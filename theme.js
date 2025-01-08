document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Kayıtlı tema varsa veya sistem temasını kullan
    const currentTheme = localStorage.getItem('theme') || 
                        (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Başlangıç temasını ayarla
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcons(currentTheme);

    // Theme toggle işlevleri
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcons(newTheme);
    }

    // İkonları güncelle
    function updateThemeIcons(theme) {
        const icons = {
            light: 'fa-moon',
            dark: 'fa-sun'
        };
        
        [themeToggle, mobileThemeToggle].forEach(button => {
            if (button) {
                const icon = button.querySelector('i');
                icon.classList.remove('fa-moon', 'fa-sun');
                icon.classList.add(icons[theme]);
            }
        });
    }

    // Event listeners
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleTheme);
    }
}); 