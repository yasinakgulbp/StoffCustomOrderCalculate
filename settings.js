document.addEventListener('DOMContentLoaded', function() {
    // Tüm sayfa geçiş linklerini seç (hem sidebar hem mobil menü)
    const allNavLinks = document.querySelectorAll('.sidebar nav a, .mobile-nav a');
    const pages = document.querySelectorAll('.page');

    function handleNavigation(e) {
        e.preventDefault();
        const targetPage = e.currentTarget.dataset.page;
        
        // Tüm linklerdeki active sınıfını kaldır
        allNavLinks.forEach(link => {
            if (link.dataset.page === targetPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Sayfaları göster/gizle
        pages.forEach(page => {
            page.style.display = page.id === `${targetPage}-page` ? 'block' : 'none';
        });
    }

    // Hem sidebar hem mobil menü linklerine event listener ekle
    allNavLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Sabit değerleri form alanlarına yükle
    loadSettings();

    // Kaydet butonu işlevselliği
    document.getElementById('saveSettings').addEventListener('click', saveSettings);
});

function loadSettings() {
    // Her input alanı için sabit değerleri yükle
    for (const [key, value] of Object.entries(CONSTANTS)) {
        const input = document.getElementById(key);
        if (input) {
            input.value = value;
        }
    }
}

function saveSettings() {
    // Tüm değerleri topla
    const newConstants = {};
    for (const key of Object.keys(CONSTANTS)) {
        const input = document.getElementById(key);
        if (input) {
            newConstants[key] = Number(input.value);
        }
    }

    // Local storage'a kaydet
    localStorage.setItem('CONSTANTS', JSON.stringify(newConstants));
    
    // Global CONSTANTS nesnesini güncelle
    Object.assign(CONSTANTS, newConstants);

    // Kullanıcıya bilgi ver
    alert('Ayarlar başarıyla kaydedildi!');
}

// Sayfa yüklendiğinde local storage'dan sabitleri yükle
const savedConstants = localStorage.getItem('CONSTANTS');
if (savedConstants) {
    Object.assign(CONSTANTS, JSON.parse(savedConstants));
} 