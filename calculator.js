document.addEventListener('DOMContentLoaded', function() {
    // Form submit olayını engelle
    const calculatorForm = document.querySelector('.form-section form');
    if (calculatorForm) {
        calculatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleCalculation();
        });
    }

    // Hesaplama butonu işlevselliği
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', handleCalculation);
    }
});

function handleCalculation() {
    if (!validateInputs()) {
        return;
    }
    
    const btn = document.getElementById('calculateBtn');
    btn.classList.add('loading');
    btn.textContent = 'Hesaplanıyor...';
    
    try {
        calculateCosts();
        // Sonuçlar bölümünü görünür yap
        document.querySelector('.results-section').style.display = 'block';
    } catch (error) {
        console.error('Hesaplama hatası:', error);
        alert('Hesaplama sırasında bir hata oluştu. Lütfen tüm değerleri kontrol edin.');
    } finally {
        btn.classList.remove('loading');
        btn.textContent = 'Hesapla';
    }
}

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
    
    // Kar oranını al
    const profitRate = Number(document.getElementById('profitRate').value) / 100;
    
    // Önerilen satış fiyatı
    const suggestedPrice = calculateSuggestedPrice(totalCost, profitRate);

    // Sonuçları göster
    displayResults({
        totalM2,
        materialCost,
        shippingCost,
        totalCost,
        suggestedPrice,
        measurements,
        totalWeight,
        profitRate
    });

    // Sonuçlar bölümüne scroll
    document.querySelector('.results-section').scrollIntoView({ behavior: 'smooth' });
}

function calculateSuggestedPrice(totalCost, profitRate) {
    return totalCost / (1 - CONSTANTS.etsyCommission) * (1 + profitRate);
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
    // Seçilen finish tipini al
    const selectedFinish = document.getElementById('finishType').value;
    const finishCost = CONSTANTS.finishOptions[selectedFinish];
    
    return totalM2 * CONSTANTS.woodPricePerM2 +
           totalM2 * finishCost +
           CONSTANTS.boxCost +
           CONSTANTS.packagingCost +
           CONSTANTS.vidaCost +
           CONSTANTS.sarfMalzeme +
           CONSTANTS.monthlyExpensePerOrder;
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

    // Seçilen finish tipini al
    const selectedFinish = document.getElementById('finishType').value;
    const finishCost = CONSTANTS.finishOptions[selectedFinish];
    const finishName = document.getElementById('finishType').options[
        document.getElementById('finishType').selectedIndex
    ].text;

    const materialDetails = [
        'PANEL MALİYETİ:',
        `  Alan: ${results.totalM2.toFixed(2)} m²`,
        `  Birim Fiyat: $${CONSTANTS.woodPricePerM2}`,
        `  Toplam: $${(results.totalM2 * CONSTANTS.woodPricePerM2).toFixed(2)}`,
        '',
        'FINISH MALİYETİ:',
        `  Seçilen Finish: ${finishName}`,
        `  Alan: ${results.totalM2.toFixed(2)} m²`,
        `  Birim Fiyat: $${finishCost}`,
        `  Toplam: $${(results.totalM2 * finishCost).toFixed(2)}`,
        '',
        'DİĞER MALİYETLER:',
        `  Paketleme: $${CONSTANTS.packagingCost}`,
        `  Vida: $${CONSTANTS.vidaCost}`,
        `  Sarf Malzeme: $${CONSTANTS.sarfMalzeme}`,
        `  Sipariş Başına Düşen Aylık Gider: $${CONSTANTS.monthlyExpensePerOrder.toFixed(2)}`,
        '',
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
        `Sipariş Başına Düşen Aylık Gider: $${CONSTANTS.monthlyExpensePerOrder.toFixed(2)}`,
        '------------------------',
        `TOPLAM MALİYET = $${results.totalCost.toFixed(2)}`
    ];
    document.getElementById('totalCostCalculationDetails').innerHTML = totalCostDetails.join('\n');

    // Önerilen satış fiyatı detayları
    const suggestedPriceDetails = [
        `Toplam Maliyet: $${results.totalCost.toFixed(2)}`,
        `Etsy Komisyonu: ${(CONSTANTS.etsyCommission * 100)}%`,
        `Kar Marjı: ${(results.profitRate * 100)}%`,
        '------------------------',
        `Hesaplama: $${results.totalCost.toFixed(2)} ÷ (1 - ${CONSTANTS.etsyCommission}) × ${1 + results.profitRate}`,
        `ÖNERİLEN SATIŞ FİYATI = $${results.suggestedPrice.toFixed(2)}`
    ];
    document.getElementById('suggestedPriceCalculationDetails').innerHTML = suggestedPriceDetails.join('\n');
}

// Input validation
function validateInputs() {
    let isValid = true;
    const requiredInputs = [
        'panelCount', 'panelWidth', 'panelLength',
        'profitRate'
    ];
    
    requiredInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (!input || input.value.trim() === '' || isNaN(input.value) || Number(input.value) < 0) {
            input.classList.add('error');
            isValid = false;
            
            // Hata mesajını göster
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