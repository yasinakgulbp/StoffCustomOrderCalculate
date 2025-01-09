const CONSTANTS = {
    woodWeightPerM2: 2.5,  // m² başına ağırlık (kg)
    shippingCostPerKg: 5.85, // kg başına kargo maliyeti ($)
    woodPricePerM2: 15,    // m² başına panel fiyatı ($)
    finishOptions: {
        unfinished: 0,              // İşlemsiz
        varnishedClear: 0.3,        // Vernikli - Şeffaf
        oilClear: 0.4,              // %0 VOC Yağ - Şeffaf
        oilWalnut: 0.45,            // %0 VOC Yağ - Ceviz
        oilBlack: 0.45,             // %0 VOC Yağ - Siyah
    },
    boxCost: 10,           // Kutu maliyeti ($)
    packagingCost: 10,     // Paketleme malzeme maliyeti ($)
    vidaCost: 10,          // Vida maliyeti ($)
    sarfMalzeme: 10,       // Sarf malzeme maliyeti ($)
    etsyCommission: 0.18,  // Etsy komisyon oranı
    customOrderFee: 50,    // Custom sipariş ücreti ($)
    monthlyExpensePerOrder: 0 // Sipariş başına düşen aylık gider ($)
}; 