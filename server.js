require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const crypto = require('crypto');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── MySQL bağlantı havuzu ───
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'mtk_user',
  password: process.env.DB_PASS || 'BURAYA_GUCLU_SIFRE_YAZ',
  database: process.env.DB_NAME || 'mtk_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
});

// ─── E-posta gönderici (Resend) ───
const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Veritabanı tablolarını oluştur ───
async function initDB() {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        INDEX idx_email (email),
        INDEX idx_username (username),
        INDEX idx_role (role)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        INDEX idx_token (token),
        INDEX idx_user_id (user_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('✅ Veritabanı hazır — tablolar kontrol edildi');
  } catch (err) {
    console.error('❌ Veritabanı hatası:', err.message);
    process.exit(1);
  }
}

// ─── Middleware'ler ───
app.set('trust proxy', 1);
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiter — brute force koruması
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Çok fazla deneme. 15 dakika sonra tekrar deneyin.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── JWT doğrulama middleware ───
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Giriş yapmanız gerekiyor.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Oturum süresi dolmuş.' });
    req.user = user;
    next();
  });
}

// ─── Admin kontrolü middleware ───
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Bu işlem için admin yetkisi gerekli.' });
  }
  next();
}

// ─── REGISTER ───
app.post('/api/register', authLimiter, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validasyon
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Tüm alanları doldurun.' });
    }

    if (username.length < 3 || username.length > 50) {
      return res.status(400).json({ error: 'Kullanıcı adı 3-50 karakter olmalı.' });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({ error: 'Kullanıcı adı sadece harf, rakam ve _ içerebilir.' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Geçerli bir e-posta adresi girin.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Şifre en az 8 karakter olmalı.' });
    }

    // Kullanıcı var mı kontrol et
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email.toLowerCase(), username.toLowerCase()]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Bu kullanıcı adı veya e-posta zaten kayıtlı.' });
    }

    // Şifreyi hashle
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Kullanıcıyı kaydet
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username.toLowerCase(), email.toLowerCase(), passwordHash]
    );

    const userId = result.insertId;

    // Token oluştur
    const token = jwt.sign(
      { id: userId, username: username.toLowerCase(), role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Kayıt başarılı!',
      token,
      user: {
        id: userId,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        role: 'user',
      },
    });
  } catch (err) {
    console.error('Register hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası. Lütfen tekrar deneyin.' });
  }
});

// ─── LOGIN ───
app.post('/api/login', authLimiter, async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ error: 'Kullanıcı adı/e-posta ve şifre gerekli.' });
    }

    // Kullanıcı adı veya email ile giriş
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE (email = ? OR username = ?) AND is_active = 1',
      [login.toLowerCase(), login.toLowerCase()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Kullanıcı bulunamadı.' });
    }

    const user = rows[0];

    // Şifre kontrolü
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Şifre hatalı.' });
    }

    // Token oluştur
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Giriş başarılı!',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası. Lütfen tekrar deneyin.' });
  }
});

// ─── ŞİFRE SIFIRLAMA İSTEĞİ ───
app.post('/api/forgot-password', authLimiter, async (req, res) => {
  try {
    const { login } = req.body;

    if (!login) {
      return res.status(400).json({ error: 'Kullanıcı adı veya e-posta girin.' });
    }

    // Kullanıcıyı bul
    const [rows] = await pool.execute(
      'SELECT id, email, username FROM users WHERE (email = ? OR username = ?) AND is_active = 1',
      [login.toLowerCase(), login.toLowerCase()]
    );

    // Güvenlik: kullanıcı bulunamasa bile aynı mesajı ver
    if (rows.length === 0) {
      return res.json({ message: 'Eğer bu hesap mevcutsa, e-posta adresine sıfırlama bağlantısı gönderildi.' });
    }

    const user = rows[0];

    // Eski kullanılmamış token'ları iptal et
    await pool.execute(
      'UPDATE password_resets SET used = 1 WHERE user_id = ? AND used = 0',
      [user.id]
    );

    // Yeni token oluştur (1 saat geçerli)
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 saat

    await pool.execute(
      'INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, token, expiresAt]
    );

    // Sıfırlama bağlantısı
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host;
    const resetUrl = `${protocol}://${host}/reset-password.html?token=${token}`;

    // E-posta gönder (Resend)
    await resend.emails.send({
      from: 'mtkaya.me <admin@mtkaya.me>',
      to: user.email,
      subject: 'Şifre Sıfırlama — mtkaya.me',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:40px 20px">
          <h2 style="color:#1a1a1e;margin-bottom:8px">Şifre Sıfırlama</h2>
          <p style="color:#555;font-size:15px">Merhaba <strong>${user.username}</strong>,</p>
          <p style="color:#555;font-size:15px">Şifrenizi sıfırlamak için aşağıdaki butona tıklayın. Bu bağlantı <strong>1 saat</strong> geçerlidir.</p>
          <div style="text-align:center;margin:32px 0">
            <a href="${resetUrl}" style="display:inline-block;padding:14px 32px;background:#c9f06b;color:#0a0a0b;text-decoration:none;border-radius:60px;font-weight:bold;font-size:15px">Şifremi Sıfırla</a>
          </div>
          <p style="color:#999;font-size:13px">Bu isteği siz yapmadıysanız bu e-postayı görmezden gelebilirsiniz.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
          <p style="color:#bbb;font-size:12px;text-align:center">mtkaya.me</p>
        </div>
      `,
    });

    res.json({ message: 'Eğer bu hesap mevcutsa, e-posta adresine sıfırlama bağlantısı gönderildi.' });
  } catch (err) {
    console.error('Şifre sıfırlama hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası. Lütfen tekrar deneyin.' });
  }
});

// ─── ŞİFRE SIFIRLAMA (yeni şifre belirleme) ───
app.post('/api/reset-password', authLimiter, async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token ve yeni şifre gerekli.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Şifre en az 8 karakter olmalı.' });
    }

    // Token'ı kontrol et
    const [rows] = await pool.execute(
      'SELECT pr.*, u.username FROM password_resets pr JOIN users u ON pr.user_id = u.id WHERE pr.token = ? AND pr.used = 0 AND pr.expires_at > NOW()',
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Geçersiz veya süresi dolmuş bağlantı. Lütfen tekrar şifre sıfırlama isteği gönderin.' });
    }

    const resetRecord = rows[0];

    // Yeni şifreyi hashle
    const passwordHash = await bcrypt.hash(password, 12);

    // Şifreyi güncelle
    await pool.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [passwordHash, resetRecord.user_id]
    );

    // Token'ı kullanılmış olarak işaretle
    await pool.execute(
      'UPDATE password_resets SET used = 1 WHERE id = ?',
      [resetRecord.id]
    );

    res.json({ message: 'Şifreniz başarıyla güncellendi! Giriş yapabilirsiniz.' });
  } catch (err) {
    console.error('Şifre güncelleme hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası. Lütfen tekrar deneyin.' });
  }
});

// ─── PROFİL (korumalı route) ───
app.get('/api/me', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    }

    res.json({ user: rows[0] });
  } catch (err) {
    console.error('Profil hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// ═══════════════════════════════════════════
// ADMIN API'leri (ileride admin paneli için hazır)
// ═══════════════════════════════════════════

// ─── ADMIN: Tüm kullanıcıları listele ───
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, username, email, role, is_active, created_at, updated_at FROM users ORDER BY created_at DESC'
    );
    res.json({ users: rows, total: rows.length });
  } catch (err) {
    console.error('Admin users hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// ─── ADMIN: Kullanıcı rolünü değiştir ───
app.patch('/api/admin/users/:id/role', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Geçersiz rol.' });
    }

    await pool.execute('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
    res.json({ message: 'Rol güncellendi.' });
  } catch (err) {
    console.error('Rol güncelleme hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// ─── ADMIN: Kullanıcıyı aktif/pasif yap ───
app.patch('/api/admin/users/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { is_active } = req.body;

    await pool.execute('UPDATE users SET is_active = ? WHERE id = ?', [is_active ? 1 : 0, req.params.id]);
    res.json({ message: is_active ? 'Kullanıcı aktifleştirildi.' : 'Kullanıcı devre dışı bırakıldı.' });
  } catch (err) {
    console.error('Durum güncelleme hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// ─── ADMIN: İstatistikler ───
app.get('/api/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [[{ total }]] = await pool.execute('SELECT COUNT(*) AS total FROM users');
    const [[{ active }]] = await pool.execute('SELECT COUNT(*) AS active FROM users WHERE is_active = 1');
    const [[{ admins }]] = await pool.execute("SELECT COUNT(*) AS admins FROM users WHERE role = 'admin'");
    const [[{ recent }]] = await pool.execute(
      'SELECT COUNT(*) AS recent FROM users WHERE created_at >= (NOW() - INTERVAL 7 DAY)'
    );
    res.json({ total, active, admins, recent });
  } catch (err) {
    console.error('Stats hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// ─── ADMIN: Tek kullanıcı detayı ───
app.get('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, username, email, role, is_active, created_at, updated_at FROM users WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    }
    res.json({ user: rows[0] });
  } catch (err) {
    console.error('Kullanıcı detay hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// ─── ADMIN: Kullanıcı bilgilerini düzenle (username, email, role, is_active) ───
app.patch('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const { username, email, role, is_active } = req.body;

    // Validasyonlar
    if (username !== undefined) {
      if (typeof username !== 'string' || username.length < 3 || username.length > 50) {
        return res.status(400).json({ error: 'Kullanıcı adı 3-50 karakter olmalı.' });
      }
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return res.status(400).json({ error: 'Kullanıcı adı sadece harf, rakam ve _ içerebilir.' });
      }
    }
    if (email !== undefined) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Geçerli bir e-posta girin.' });
      }
    }
    if (role !== undefined && !['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Geçersiz rol.' });
    }

    // Kendi rolünü admin'den düşürmesini engelle
    if (userId === req.user.id && role === 'user') {
      return res.status(400).json({ error: 'Kendi admin yetkinizi kaldıramazsınız.' });
    }
    if (userId === req.user.id && is_active === false) {
      return res.status(400).json({ error: 'Kendi hesabınızı devre dışı bırakamazsınız.' });
    }

    // Benzersizlik kontrolü
    if (username || email) {
      const [conflict] = await pool.execute(
        'SELECT id FROM users WHERE (username = ? OR email = ?) AND id <> ?',
        [username ? username.toLowerCase() : '', email ? email.toLowerCase() : '', userId]
      );
      if (conflict.length > 0) {
        return res.status(409).json({ error: 'Bu kullanıcı adı veya e-posta başka bir hesapta kullanılıyor.' });
      }
    }

    const fields = [];
    const values = [];
    if (username !== undefined) { fields.push('username = ?'); values.push(username.toLowerCase()); }
    if (email !== undefined) { fields.push('email = ?'); values.push(email.toLowerCase()); }
    if (role !== undefined) { fields.push('role = ?'); values.push(role); }
    if (is_active !== undefined) { fields.push('is_active = ?'); values.push(is_active ? 1 : 0); }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'Güncellenecek alan yok.' });
    }

    values.push(userId);
    await pool.execute(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);

    const [rows] = await pool.execute(
      'SELECT id, username, email, role, is_active, created_at, updated_at FROM users WHERE id = ?',
      [userId]
    );
    res.json({ message: 'Kullanıcı güncellendi.', user: rows[0] });
  } catch (err) {
    console.error('Kullanıcı güncelleme hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// ─── ADMIN: Kullanıcı sil ───
app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    if (userId === req.user.id) {
      return res.status(400).json({ error: 'Kendi hesabınızı silemezsiniz.' });
    }

    const [rows] = await pool.execute('SELECT id FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    }

    await pool.execute('DELETE FROM users WHERE id = ?', [userId]);
    res.json({ message: 'Kullanıcı silindi.' });
  } catch (err) {
    console.error('Kullanıcı silme hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// ─── ADMIN: Kullanıcı şifresini sıfırla (yeni şifre belirle) ───
app.post('/api/admin/users/:id/reset-password', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Şifre en az 8 karakter olmalı.' });
    }

    const [rows] = await pool.execute('SELECT id FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await pool.execute('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, req.params.id]);

    res.json({ message: 'Şifre başarıyla güncellendi.' });
  } catch (err) {
    console.error('Admin şifre sıfırlama hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// ─── Tüm route'ları frontend'e yönlendir ───
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Endpoint bulunamadı.' });
  }

  const filePath = path.join(__dirname, 'public', req.path);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
  });
});

// ─── Sunucuyu başlat ───
initDB().then(() => {
  app.listen(PORT, '127.0.0.1', () => {
    console.log(`🚀 Sunucu http://127.0.0.1:${PORT} adresinde çalışıyor`);
  });
});
