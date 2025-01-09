document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculateDiscount');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateDiscount);
    }
});

function calculateDiscount() {
    const originalPrice = Number(document.getElementById('originalPrice').value);
    const realDiscount = Number(document.getElementById('realDiscount').value) / 100;
    const displayDiscount = Number(document.getElementById('displayDiscount').value) / 100;

    // Gerçek indirimli fiyatı hesapla
    const targetPrice = originalPrice * (1 - realDiscount);
    
    // Görünecek fiyatı hesapla
    const websitePrice = targetPrice / (1 - displayDiscount);

    // Sonuçları göster
    document.getElementById('websitePrice').textContent = `$${websitePrice.toFixed(2)}`;
    document.getElementById('finalPrice').textContent = `$${targetPrice.toFixed(2)}`;

    // Detaylı hesaplama
    const details = [
        'HESAPLAMA DETAYLARI:',
        `Ürün Gerçek Fiyatı: $${originalPrice.toFixed(2)}`,
        '',
        'GERÇEK İNDİRİM:',
        `  İndirim Oranı: %${(realDiscount * 100).toFixed(1)}`,
        `  İndirim Tutarı: $${(originalPrice * realDiscount).toFixed(2)}`,
        `  İndirimli Fiyat: $${targetPrice.toFixed(2)}`,
        '',
        'WEB SİTESİ GÖRÜNÜMÜ:',
        `  Görünecek Fiyat: $${websitePrice.toFixed(2)}`,
        `  Görünecek İndirim: %${(displayDiscount * 100).toFixed(1)}`,
        `  İndirimli Fiyat: $${targetPrice.toFixed(2)}`,
        '',
        'ÖZET:',
        `  Web sitesinde ürün $${websitePrice.toFixed(2)} fiyatla listelenecek`,
        `  %${(displayDiscount * 100).toFixed(1)} indirim görünecek`,
        `  Müşteri $${targetPrice.toFixed(2)} ödeyecek`,
        `  Gerçek indirim oranı %${(realDiscount * 100).toFixed(1)} olacak`
    ];

    document.getElementById('discountCalculationDetails').innerHTML = details.join('\n');
    document.querySelector('.discount-results').style.display = 'block';
} 