document.getElementById('calculateBtn').addEventListener('click', function() {
    if (!validateInputs()) {
        return;
    }
    
    // Show loading state
    this.classList.add('loading');
    this.textContent = 'Hesaplanıyor...';
    
    setTimeout(() => {
        calculateCosts();
        
        // Remove loading state
        this.classList.remove('loading');
        this.textContent = 'Hesapla';
        
        // Show success message
        const successMsg = document.querySelector('.success-message') || 
                          document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.textContent = 'Hesaplama başarıyla tamamlandı!';
        successMsg.style.display = 'block';
        
        if (!document.querySelector('.success-message')) {
            document.querySelector('.results-section').prepend(successMsg);
        }
        
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 3000);
    }, 500);
});

function calculateCosts() {
    // Tüm ölçüleri topla
    const measurements = {
        panels: getMeasurements('panel'),
        supports: getMeasurements('support'),
        shelves: getMeasurements('shelf'),
        doors: getMeasurements('door')
    };

    // Toplam m² hesapla
    const totalM2 = calculateTotalArea(measurements);
    
    // Toplam ağırlık hesapla
    const totalWeight = totalM2 * CONSTANTS.woodWeightPerM2;
    
    // Malzeme maliyeti hesapla
    const materialCost = calculateMaterialCost(totalM2);
    
    // Kargo maliyeti hesapla
    const shippingCost = totalWeight * CONSTANTS.shippingCostPerKg;
    
    // Toplam maliyet
    const totalCost = materialCost + shippingCost + CONSTANTS.customOrderFee;
    
    // Önerilen satış fiyatı (kar marjı %30 olarak varsayıldı)
    const suggestedPrice = totalCost / (1 - CONSTANTS.etsyCommission) * 1.3;

    // Sonuçları göster
    displayResults({
        totalM2,
        materialCost,
        shippingCost,
        totalCost,
        suggestedPrice,
        measurements, // Ölçümleri de gönderiyoruz
        totalWeight  // Toplam ağırlığı da gönderiyoruz
    });
}

function getMeasurements(prefix) {
    const count = Number(document.getElementById(`${prefix}Count`).value) || 0;
    const width = Number(document.getElementById(`${prefix}Width`).value) || 0;
    const length = Number(document.getElementById(`${prefix}Length`).value) || 0;
    
    return {
        count,
        width,
        length,
        area: (width * length * count) / 10000 // cm²'den m²'ye çevir
    };
}

function calculateTotalArea(measurements) {
    return Object.values(measurements).reduce((sum, item) => sum + item.area, 0);
}

function calculateMaterialCost(totalM2) {
    return totalM2 * CONSTANTS.woodPricePerM2 +
           totalM2 * CONSTANTS.varnishCostPerM2 +
           CONSTANTS.boxCost +
           CONSTANTS.packagingCost +
           CONSTANTS.vidaCost +
           CONSTANTS.sarfMalzeme;
}

function displayResults(results) {
    // Mevcut sonuç gösterimi
    document.getElementById('totalM2').textContent = results.totalM2.toFixed(2) + ' m²';
    document.getElementById('materialCost').textContent = '$' + results.materialCost.toFixed(2);
    document.getElementById('shippingCost').textContent = '$' + results.shippingCost.toFixed(2);
    document.getElementById('totalCost').textContent = '$' + results.totalCost.toFixed(2);
    document.getElementById('suggestedPrice').textContent = '$' + results.suggestedPrice.toFixed(2);

    // Alan hesaplama detayları
    const areaDetails = [];
    for (const [key, value] of Object.entries(results.measurements)) {
        if (value.area > 0) {
            areaDetails.push(
                `${key.toUpperCase()}:`,
                `  ${value.count} adet × ${value.width} cm × ${value.length} cm`,
                `  = ${value.area.toFixed(4)} m²`
            );
        }
    }
    areaDetails.push(
        '------------------------',
        `TOPLAM ALAN = ${results.totalM2.toFixed(2)} m²`
    );
    document.getElementById('areaCalculationDetails').innerHTML = areaDetails.join('\n');

    // Malzeme maliyeti detayları
    const materialDetails = [
        `Panel Maliyeti: ${results.totalM2.toFixed(2)} m² × $${CONSTANTS.woodPricePerM2} = $${(results.totalM2 * CONSTANTS.woodPricePerM2).toFixed(2)}`,
        `Vernik Maliyeti: ${results.totalM2.toFixed(2)} m² × $${CONSTANTS.varnishCostPerM2} = $${(results.totalM2 * CONSTANTS.varnishCostPerM2).toFixed(2)}`,
        `Kutu Maliyeti: $${CONSTANTS.boxCost}`,
        `Paketleme Maliyeti: $${CONSTANTS.packagingCost}`,
        `Vida Maliyeti: $${CONSTANTS.vidaCost}`,
        `Sarf Malzeme: $${CONSTANTS.sarfMalzeme}`,
        '------------------------',
        `TOPLAM MALZEME MALİYETİ = $${results.materialCost.toFixed(2)}`
    ];
    document.getElementById('materialCalculationDetails').innerHTML = materialDetails.join('\n');

    // Kargo maliyeti detayları
    const shippingDetails = [
        `Toplam Ağırlık: ${results.totalM2.toFixed(2)} m² × ${CONSTANTS.woodWeightPerM2} kg/m²`,
        `  = ${results.totalWeight.toFixed(2)} kg`,
        `Kargo Maliyeti: ${results.totalWeight.toFixed(2)} kg × $${CONSTANTS.shippingCostPerKg}/kg`,
        '------------------------',
        `TOPLAM KARGO MALİYETİ = $${results.shippingCost.toFixed(2)}`
    ];
    document.getElementById('shippingCalculationDetails').innerHTML = shippingDetails.join('\n');

    // Toplam maliyet detayları
    const totalCostDetails = [
        `Malzeme Maliyeti: $${results.materialCost.toFixed(2)}`,
        `Kargo Maliyeti: $${results.shippingCost.toFixed(2)}`,
        `Özel Sipariş Ücreti: $${CONSTANTS.customOrderFee}`,
        '------------------------',
        `TOPLAM MALİYET = $${results.totalCost.toFixed(2)}`
    ];
    document.getElementById('totalCostCalculationDetails').innerHTML = totalCostDetails.join('\n');

    // Önerilen satış fiyatı detayları
    const suggestedPriceDetails = [
        `Toplam Maliyet: $${results.totalCost.toFixed(2)}`,
        `Etsy Komisyonu: ${(CONSTANTS.etsyCommission * 100)}%`,
        `Kar Marjı: 30%`,
        '------------------------',
        `Hesaplama: $${results.totalCost.toFixed(2)} ÷ (1 - ${CONSTANTS.etsyCommission}) × 1.3`,
        `ÖNERİLEN SATIŞ FİYATI = $${results.suggestedPrice.toFixed(2)}`
    ];
    document.getElementById('suggestedPriceCalculationDetails').innerHTML = suggestedPriceDetails.join('\n');
}

// Input validation
function validateInputs() {
    let isValid = true;
    const inputs = document.querySelectorAll('input[type="number"]');
    
    inputs.forEach(input => {
        const value = input.value.trim();
        if (value === '' || value < 0) {
            input.classList.add('error');
            isValid = false;
            
            // Show error message
            const errorMsg = input.parentElement.querySelector('.error-message') || 
                           document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Lütfen geçerli bir değer girin';
            errorMsg.style.display = 'block';
            
            if (!input.parentElement.querySelector('.error-message')) {
                input.parentElement.appendChild(errorMsg);
            }
        } else {
            input.classList.remove('error');
            const errorMsg = input.parentElement.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.style.display = 'none';
            }
        }
    });
    
    return isValid;
} 