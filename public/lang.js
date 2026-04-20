// ─── Language System v2 ───
(function() {
  var T = {
    // ═══ NAV ═══
    'nav.about': { tr: 'Hakkımda', en: 'About' },
    'nav.projects': { tr: 'Projeler', en: 'Projects' },
    'nav.github': { tr: 'GitHub', en: 'GitHub' },
    'nav.youtube': { tr: 'YouTube', en: 'YouTube' },
    'nav.contact': { tr: 'İletişim', en: 'Contact' },
    'nav.login': { tr: 'Giriş Yap / Kayıt Ol', en: 'Login / Register' },

    // ═══ HERO ═══
    'hero.label': { tr: 'Yazılım Mühendisliği Öğrencisi', en: 'Software Engineering Student' },
    'hero.subtitle': { tr: 'Fırat Üniversitesi Yazılım Mühendisliği öğrencisi. Yapay zeka, gömülü sistemler, siber güvenlik ve yazılım projeleri üzerine çalışıyorum.', en: 'Software Engineering student at Fırat University. Working on artificial intelligence, embedded systems, cybersecurity and software projects.' },
    'hero.github': { tr: "GitHub'ı İncele", en: 'View GitHub' },
    'hero.projects': { tr: 'Projelerim ↓', en: 'My Projects ↓' },

    // ═══ ABOUT ═══
    'about.label': { tr: 'Hakkımda', en: 'About Me' },
    'about.title': { tr: 'Kod yazmak, <br>geleceği inşa etmek.', en: 'Writing code, <br>building the future.' },
    'about.p1': { tr: '<strong>Fırat Üniversitesi Yazılım Mühendisliği</strong> bölümünde eğitim alıyorum. Teknolojiye olan tutkumu projelerimle hayata geçiriyorum.', en: 'Studying at <strong>Fırat University Software Engineering</strong> department. I bring my passion for technology to life through my projects.' },
    'about.p2': { tr: 'Özellikle <strong>yapay zeka</strong>, <strong>gömülü sistemler</strong> ve <strong>siber güvenlik</strong> alanlarında çalışıyorum. C++, C# ve Python ile projeler geliştirmek en büyük motivasyonum.', en: 'I specialize in <strong>artificial intelligence</strong>, <strong>embedded systems</strong> and <strong>cybersecurity</strong>. Building projects with C++, C# and Python is my biggest motivation.' },
    'about.p3': { tr: 'YouTube kanalımda yazılım mühendisliği sürecimi ve projelerimi paylaşıyorum.', en: 'I share my software engineering journey and projects on my YouTube channel.' },
    'about.tag.ai': { tr: 'Yapay Zeka', en: 'Artificial Intelligence' },
    'about.tag.cyber': { tr: 'Siber Güvenlik', en: 'Cybersecurity' },
    'about.tag.3d': { tr: '3D Modelleme', en: '3D Modeling' },
    'about.tag.embedded': { tr: 'Gömülü Sistemler', en: 'Embedded Systems' },
    'stat.repo': { tr: 'Repo', en: 'Repos' },
    'stat.commit': { tr: 'Commit', en: 'Commits' },
    'stat.star': { tr: 'Yıldız', en: 'Stars' },

    // ═══ PROJECTS ═══
    'projects.label': { tr: 'Projeler', en: 'Projects' },
    'projects.title': { tr: 'Üzerinde çalıştığım<br>projeler.', en: 'Projects I\'m<br>working on.' },
    'projects.badge': { tr: 'Geliştirme Aşamasında', en: 'In Development' },
    'projects.name': { tr: '🏙️ Sanal Şehir Keşfi', en: '🏙️ Virtual City Explorer' },
    'projects.desc': { tr: 'Kullanıcıların tarihi ve kültürel mekanları sanal gerçeklik ortamında keşfedebileceği bir VR simülasyon uygulaması. Sanal bir şehir ortamında dolaşarak önemli yapılar hakkında bilgi edinme ve etkileşimli keşif deneyimi.', en: 'A VR simulation app where users can explore historical and cultural sites in a virtual reality environment. An interactive discovery experience walking through a virtual city and learning about important structures.' },
    'projects.link': { tr: "GitHub'da İncele", en: 'View on GitHub' },
    'projects.team': { tr: 'Proje Ekibi', en: 'Project Team' },

    // ═══ GITHUB ═══
    'github.label': { tr: 'GitHub', en: 'GitHub' },
    'github.title': { tr: 'Açık kaynak &<br>geliştirme.', en: 'Open source &<br>development.' },
    'github.info': { tr: 'Yazılım Mühendisliği Öğrencisi · Fırat Üniversitesi', en: 'Software Engineering Student · Fırat University' },
    'github.view': { tr: 'Profili Görüntüle', en: 'View Profile' },

    // ═══ YOUTUBE ═══
    'youtube.label': { tr: 'YouTube', en: 'YouTube' },
    'youtube.title': { tr: 'İçeriklerim &<br>videolarım.', en: 'My content &<br>videos.' },
    'youtube.desc': { tr: 'Yazılım mühendisliği sürecimi, projelerimi ve öğrendiklerimi YouTube kanalımda paylaşıyorum. Abone olarak destek verebilirsiniz!', en: 'I share my software engineering journey, projects and learnings on my YouTube channel. Subscribe to support!' },
    'youtube.link': { tr: 'Kanala Git', en: 'Go to Channel' },

    // ═══ CONTACT ═══
    'contact.label': { tr: 'İletişim', en: 'Contact' },
    'contact.title': { tr: 'Birlikte çalışalım.', en: "Let's work together." },
    'contact.email': { tr: 'E-posta', en: 'Email' },
    'contact.desc': { tr: 'Projeler, iş birlikleri veya sadece merhaba demek için bana ulaşabilirsiniz.', en: 'Feel free to reach out for projects, collaborations or just to say hello.' },

    // ═══ FOOTER ═══
    'footer.copy': { tr: '© 2026 Mehmet Talha Kaya · Fırat Üniversitesi Yazılım Mühendisliği', en: '© 2026 Mehmet Talha Kaya · Fırat University Software Engineering' },

    // ═══ MARQUEE ═══
    'marquee.se': { tr: 'Yazılım Mühendisliği', en: 'Software Engineering' },
    'marquee.ai': { tr: 'Yapay Zeka', en: 'Artificial Intelligence' },
    'marquee.cyber': { tr: 'Siber Güvenlik', en: 'Cybersecurity' },
    'marquee.3d': { tr: '3D Modelleme', en: '3D Modeling' },
    'marquee.embedded': { tr: 'Gömülü Sistemler', en: 'Embedded Systems' },
    'marquee.game': { tr: 'Oyun Geliştirme', en: 'Game Development' },
    'marquee.problem': { tr: 'Problem Çözme', en: 'Problem Solving' },

    // ═══ LOGIN/REGISTER PAGE ═══
    'auth.welcome': { tr: 'Hoş <em>geldin</em>', en: 'Wel<em>come</em>' },
    'auth.subtitle': { tr: 'Hesabına giriş yap veya yeni hesap oluştur', en: 'Login to your account or create a new one' },
    'auth.tab.login': { tr: 'Giriş Yap', en: 'Login' },
    'auth.tab.register': { tr: 'Kayıt Ol', en: 'Register' },
    'auth.login.label': { tr: 'Kullanıcı Adı veya E-posta', en: 'Username or Email' },
    'auth.password': { tr: 'Şifre', en: 'Password' },
    'auth.forgot': { tr: 'Şifremi Unuttum', en: 'Forgot Password' },
    'auth.login.btn': { tr: 'Giriş Yap', en: 'Login' },
    'auth.reg.username': { tr: 'Kullanıcı Adı', en: 'Username' },
    'auth.reg.email': { tr: 'E-posta', en: 'Email' },
    'auth.reg.password': { tr: 'Şifre', en: 'Password' },
    'auth.reg.btn': { tr: 'Kayıt Ol', en: 'Register' },
    'auth.forgot.title': { tr: 'Şifremi <em>Unuttum</em>', en: 'Forgot <em>Password</em>' },
    'auth.forgot.subtitle': { tr: 'Sana bir sıfırlama bağlantısı göndereceğiz', en: 'We will send you a reset link' },
    'auth.forgot.label': { tr: 'Kullanıcı Adı veya E-posta', en: 'Username or Email' },
    'auth.forgot.btn': { tr: 'Sıfırlama Bağlantısı Gönder', en: 'Send Reset Link' },
    'auth.forgot.desc': { tr: 'Kullanıcı adını veya e-posta adresini gir, sana sıfırlama bağlantısı gönderelim.', en: 'Enter your username or email and we\'ll send you a reset link.' },

    // Placeholders
    'ph.login': { tr: 'kullanici_adi veya ornek@mail.com', en: 'username or example@mail.com' },
    'ph.password': { tr: '••••••••', en: '••••••••' },
    'ph.username': { tr: 'kullanici_adi', en: 'username' },
    'ph.email': { tr: 'ornek@mail.com', en: 'example@mail.com' },
    'ph.newpass': { tr: 'En az 8 karakter', en: 'At least 8 characters' },
    'ph.confirmpass': { tr: 'Aynı şifreyi tekrar gir', en: 'Re-enter the same password' },

    // Password strength
    'str.weak': { tr: 'Zayıf', en: 'Weak' },
    'str.medium': { tr: 'Orta', en: 'Medium' },
    'str.good': { tr: 'İyi', en: 'Good' },
    'str.strong': { tr: 'Güçlü', en: 'Strong' },

    // JS messages (login/register)
    'msg.login.fail': { tr: 'Giriş başarısız.', en: 'Login failed.' },
    'msg.login.ok': { tr: 'Giriş başarılı! Yönlendiriliyorsunuz...', en: 'Login successful! Redirecting...' },
    'msg.reg.fail': { tr: 'Kayıt başarısız.', en: 'Registration failed.' },
    'msg.reg.ok': { tr: 'Kayıt başarılı! Yönlendiriliyorsunuz...', en: 'Registration successful! Redirecting...' },
    'msg.server': { tr: 'Sunucuya bağlanılamadı. Lütfen tekrar deneyin.', en: 'Could not connect to server. Please try again.' },
    'msg.reset.sent': { tr: 'Sıfırlama bağlantısı e-posta adresine gönderildi! Gelen kutunu kontrol et.', en: 'Reset link sent to your email! Check your inbox.' },
    'msg.reset.error': { tr: 'Bir hata oluştu.', en: 'An error occurred.' },
    'msg.pass.mismatch': { tr: 'Şifreler eşleşmiyor.', en: 'Passwords do not match.' },
    'msg.invalid.link': { tr: 'Geçersiz bağlantı. Lütfen şifre sıfırlama isteğini tekrar gönderin.', en: 'Invalid link. Please request a new password reset.' },

    // ═══ DASHBOARD ═══
    'dash.welcome': { tr: 'Hoş geldin,', en: 'Welcome,' },
    'dash.desc': { tr: 'Hesabın başarıyla doğrulandı. Aşağıda profil bilgilerin yer alıyor.', en: 'Your account has been verified. Your profile information is below.' },
    'dash.username': { tr: 'Kullanıcı Adı', en: 'Username' },
    'dash.email': { tr: 'E-posta', en: 'Email' },
    'dash.date': { tr: 'Kayıt Tarihi', en: 'Registration Date' },
    'dash.dashboard': { tr: 'Kullanıcı Paneli', en: 'Dashboard' },
    'dash.adminpanel': { tr: 'Yönetici Paneli', en: 'Admin Panel' },
    'dash.logout': { tr: 'Çıkış Yap', en: 'Logout' },
    'dash.loading': { tr: 'Yükleniyor...', en: 'Loading...' },
    'dash.error': { tr: 'Bir hata oluştu. Lütfen tekrar deneyin.', en: 'Something went wrong. Please try again.' },

    // ═══ ADMIN PANEL ═══
    'admin.title': { tr: 'Yönetici <em>Paneli</em>', en: 'Admin <em>Panel</em>' },
    'admin.subtitle': { tr: 'Kullanıcıları yönet, istatistikleri görüntüle.', en: 'Manage users, view statistics.' },
    'admin.badge': { tr: 'Yönetici', en: 'Admin' },
    'admin.stat.total': { tr: 'Toplam Kullanıcı', en: 'Total Users' },
    'admin.stat.totalsub': { tr: 'Kayıtlı tüm hesaplar', en: 'All registered accounts' },
    'admin.stat.active': { tr: 'Aktif Kullanıcı', en: 'Active Users' },
    'admin.stat.activesub': { tr: 'Giriş yapabilen hesaplar', en: 'Accounts that can log in' },
    'admin.stat.admins': { tr: 'Yöneticiler', en: 'Admins' },
    'admin.stat.adminssub': { tr: 'Yetkili yöneticiler', en: 'Authorized administrators' },
    'admin.stat.recent': { tr: 'Son 7 Gün', en: 'Last 7 Days' },
    'admin.stat.recentsub': { tr: 'Yeni kayıtlar', en: 'New signups' },
    'admin.search.ph': { tr: 'Kullanıcı adı veya e-posta ara...', en: 'Search by username or email...' },
    'admin.filter.allroles': { tr: 'Tüm Roller', en: 'All Roles' },
    'admin.filter.admin': { tr: 'Yönetici', en: 'Admin' },
    'admin.filter.user': { tr: 'Kullanıcı', en: 'User' },
    'admin.filter.allstatus': { tr: 'Tüm Durumlar', en: 'All Statuses' },
    'admin.filter.active': { tr: 'Aktif', en: 'Active' },
    'admin.filter.inactive': { tr: 'Pasif', en: 'Inactive' },
    'admin.btn.refresh': { tr: 'Yenile', en: 'Refresh' },
    'admin.th.user': { tr: 'Kullanıcı', en: 'User' },
    'admin.th.email': { tr: 'E-posta', en: 'Email' },
    'admin.th.role': { tr: 'Rol', en: 'Role' },
    'admin.th.status': { tr: 'Durum', en: 'Status' },
    'admin.th.date': { tr: 'Kayıt Tarihi', en: 'Registration Date' },
    'admin.th.actions': { tr: 'İşlemler', en: 'Actions' },
    'admin.badge.admin': { tr: 'Yönetici', en: 'Admin' },
    'admin.badge.user': { tr: 'Kullanıcı', en: 'User' },
    'admin.badge.active': { tr: 'Aktif', en: 'Active' },
    'admin.badge.inactive': { tr: 'Pasif', en: 'Inactive' },
    'admin.empty.title': { tr: 'Kullanıcı bulunamadı', en: 'No users found' },
    'admin.empty.desc': { tr: 'Arama kriterlerine uygun kullanıcı yok.', en: 'No users match your filter criteria.' },
    'admin.pag.count': { tr: 'kullanıcı', en: 'users' },
    'admin.denied.title': { tr: 'Erişim <em>reddedildi</em>', en: 'Access <em>denied</em>' },
    'admin.denied.desc': { tr: 'Bu sayfayı görüntülemek için yönetici yetkisine sahip olmanız gerekiyor.', en: 'You need admin privileges to view this page.' },
    'admin.denied.back': { tr: "Kullanıcı Paneli'ne Dön", en: 'Back to Dashboard' },
    'admin.edit.title': { tr: 'Kullanıcıyı <em>düzenle</em>', en: 'Edit <em>user</em>' },
    'admin.edit.username': { tr: 'Kullanıcı Adı', en: 'Username' },
    'admin.edit.role': { tr: 'Rol', en: 'Role' },
    'admin.edit.email': { tr: 'E-posta', en: 'Email' },
    'admin.edit.active': { tr: 'Hesap Aktif', en: 'Account Active' },
    'admin.edit.password': { tr: 'Yeni Şifre (isteğe bağlı, min 8 karakter)', en: 'New Password (optional, min 8 chars)' },
    'admin.edit.password.ph': { tr: 'Boş bırak = değişmez', en: 'Leave empty = unchanged' },
    'admin.edit.cancel': { tr: 'İptal', en: 'Cancel' },
    'admin.edit.save': { tr: 'Kaydet', en: 'Save' },
    'admin.del.title': { tr: 'Silme <em>onayı</em>', en: 'Delete <em>confirmation</em>' },
    'admin.del.warn1': { tr: 'kullanıcısını silmek üzeresiniz.', en: 'will be permanently deleted.' },
    'admin.del.warn2': { tr: 'Bu işlem <strong style="color:var(--accent3)">geri alınamaz</strong>. Kullanıcının hesabı ve ilgili verileri kalıcı olarak silinecek.', en: 'This action is <strong style="color:var(--accent3)">irreversible</strong>. The user\'s account and all related data will be permanently removed.' },
    'admin.del.confirm': { tr: 'Evet, Sil', en: 'Yes, Delete' },
    'admin.toast.updated': { tr: 'Kullanıcı güncellendi', en: 'User updated' },
    'admin.toast.deleted': { tr: 'Kullanıcı silindi', en: 'User deleted' },
    'admin.toast.selfdelete': { tr: 'Kendi hesabınızı silemezsiniz.', en: 'You cannot delete your own account.' },
    'admin.action.edit': { tr: 'Düzenle', en: 'Edit' },
    'admin.action.delete': { tr: 'Sil', en: 'Delete' },
    'admin.self': { tr: '(siz)', en: '(you)' },

    // ═══ RESET PASSWORD ═══
    'reset.title': { tr: 'Yeni <em>Şifre</em>', en: 'New <em>Password</em>' },
    'reset.subtitle': { tr: 'Yeni şifreni belirle', en: 'Set your new password' },
    'reset.new': { tr: 'Yeni Şifre', en: 'New Password' },
    'reset.confirm': { tr: 'Şifreyi Tekrarla', en: 'Confirm Password' },
    'reset.btn': { tr: 'Şifremi Güncelle', en: 'Update Password' },
    'reset.success': { tr: 'Şifren başarıyla güncellendi!', en: 'Your password has been updated!' },
    'reset.login': { tr: 'Giriş Yap →', en: 'Login →' },

    // ═══ GITHUB JS DYNAMIC ═══
    'js.loading': { tr: 'Yükleniyor...', en: 'Loading...' },
    'js.loadingdesc': { tr: 'GitHub repo verileri getiriliyor.', en: 'Fetching GitHub repo data.' },
    'js.norepo': { tr: 'Repo bulunamadı', en: 'No repos found' },
    'js.norepodesc': { tr: 'GitHub hesabında gösterilecek uygun repo bulunamadı.', en: 'No suitable repos found in the GitHub account.' },
    'js.nolang': { tr: 'Dil yok', en: 'No language' },
    'js.publicrepo': { tr: 'Public Repo', en: 'Public Repo' },
    'js.profilerepo': { tr: 'Profil Repo', en: 'Profile Repo' },
    'js.archive': { tr: 'Arşiv', en: 'Archive' },
    'js.fork': { tr: 'Fork', en: 'Fork' },
    'js.commitloading': { tr: 'Commit yükleniyor', en: 'Loading commits' },
    'js.githubfail': { tr: 'GitHub verisi alınamadı', en: 'Failed to fetch GitHub data' },
    'js.githubfaildesc': { tr: 'API limiti, internet erişimi veya kullanıcı adı nedeniyle repo verileri yüklenemedi.', en: 'Repo data could not be loaded due to API limit, internet access or username issues.' },
    'js.nodesc': { tr: 'Bu repo için açıklama girilmemiş.', en: 'No description provided for this repo.' },
  };

  function setLang(lang) {
    localStorage.setItem('lang', lang);
    document.documentElement.setAttribute('lang', lang);

    // Update all elements with data-i18n (innerHTML)
    var elements = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < elements.length; i++) {
      var key = elements[i].getAttribute('data-i18n');
      var val = T[key];
      if (val && val[lang]) {
        elements[i].innerHTML = val[lang];
      }
    }

    // Update all placeholders with data-i18n-ph
    var phElements = document.querySelectorAll('[data-i18n-ph]');
    for (var i = 0; i < phElements.length; i++) {
      var key = phElements[i].getAttribute('data-i18n-ph');
      var val = T[key];
      if (val && val[lang]) {
        phElements[i].placeholder = val[lang];
      }
    }

    // Update toggle button
    var btn = document.getElementById('lang-toggle');
    if (btn) {
      btn.innerHTML = '<img src="/flag-tr.svg" alt="TR" class="' + (lang === 'tr' ? 'active' : '') + '"><img src="/flag-en.svg" alt="EN" class="' + (lang === 'en' ? 'active' : '') + '">';
    }

    // Notify other scripts that language changed
    window.dispatchEvent(new CustomEvent('langChanged', { detail: { lang: lang } }));
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', function() {
    var saved = localStorage.getItem('lang') || 'tr';
    var btn = document.getElementById('lang-toggle');
    if (btn) {
      btn.innerHTML = '<img src="/flag-tr.svg" alt="TR" class="' + (saved === 'tr' ? 'active' : '') + '"><img src="/flag-en.svg" alt="EN" class="' + (saved === 'en' ? 'active' : '') + '">';
      btn.addEventListener('click', function() {
        var current = localStorage.getItem('lang') || 'tr';
        setLang(current === 'tr' ? 'en' : 'tr');
      });
    }
    setLang(saved);
  });

  // Global helpers
  window.setLang = setLang;
  window.t = function(key) {
    var lang = localStorage.getItem('lang') || 'tr';
    return (T[key] && T[key][lang]) ? T[key][lang] : key;
  };
})();
