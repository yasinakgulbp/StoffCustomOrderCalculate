// Varsayılan değerler
const DEFAULT_EXPENSES = {
    workerSalaries: 6450,
    insurancePremiums: 1400,
    mealExpenses: 850,
    rent: 1126,
    electricity: 230,
    water: 50,
    internet: 15,
    accounting: 400,
    maintenance: 50,
    other: 2500,
    monthlyOrders: 57
};

document.addEventListener('DOMContentLoaded', function() {
    const calculateExpensesBtn = document.getElementById('calculateExpenses');
    if (calculateExpensesBtn) {
        calculateExpensesBtn.addEventListener('click', calculateMonthlyExpenses);
    }

    // Sayfa yüklendiğinde varsayılan değerleri yükle
    loadDefaultExpenses();
});

function loadDefaultExpenses() {
    // Local storage'dan kayıtlı değerleri al veya varsayılan değerleri kullan
    const savedExpenses = JSON.parse(localStorage.getItem('savedExpenses')) || DEFAULT_EXPENSES;
    
    // Tüm input alanlarını doldur
    Object.keys(savedExpenses).forEach(key => {
        const input = document.getElementById(key);
        if (input) {
            input.value = savedExpenses[key];
        }
    });

    // Sayfa yüklendiğinde hesaplamayı otomatik yap
    calculateMonthlyExpenses();
}

function calculateMonthlyExpenses() {
    // Tüm gider inputlarını topla
    const expenses = {
        workerSalaries: getExpenseValue('workerSalaries'),
        insurancePremiums: getExpenseValue('insurancePremiums'),
        mealExpenses: getExpenseValue('mealExpenses'),
        rent: getExpenseValue('rent'),
        electricity: getExpenseValue('electricity'),
        water: getExpenseValue('water'),
        internet: getExpenseValue('internet'),
        accounting: getExpenseValue('accounting'),
        maintenance: getExpenseValue('maintenance'),
        other: getExpenseValue('other'),
        monthlyOrders: getExpenseValue('monthlyOrders')
    };

    // Değerleri local storage'a kaydet
    localStorage.setItem('savedExpenses', JSON.stringify(expenses));

    // Toplam aylık gideri hesapla
    const totalMonthlyExpense = Object.entries(expenses)
        .filter(([key]) => key !== 'monthlyOrders')
        .reduce((sum, [, value]) => sum + value, 0);

    // Aylık ortalama sipariş sayısını al
    const monthlyOrders = expenses.monthlyOrders;
    if (!monthlyOrders) {
        alert('Lütfen aylık ortalama sipariş sayısını girin!');
        return;
    }

    // Sipariş başına düşen gider
    const expensePerOrder = totalMonthlyExpense / monthlyOrders;

    // Sonuçları göster
    displayExpenseResults(totalMonthlyExpense, expensePerOrder, expenses);

    // Sadece hesaplama sonuçlarını göster, CONSTANTS'ı güncelleme
    // localStorage.setItem('CONSTANTS', JSON.stringify(CONSTANTS));
}

function getExpenseValue(id) {
    const input = document.getElementById(id);
    return input ? Number(input.value) || 0 : 0;
}

function displayExpenseResults(totalMonthlyExpense, expensePerOrder, expenses) {
    const resultsDiv = document.querySelector('.expense-results');
    resultsDiv.style.display = 'block';

    document.getElementById('totalMonthlyExpense').textContent = 
        `$${totalMonthlyExpense.toFixed(2)}`;
    document.getElementById('expensePerOrder').textContent = 
        `$${expensePerOrder.toFixed(2)}`;

    // Detaylı analiz
    const details = [
        'AYLIK GİDER DETAYLARI:',
        `İşçi Maaşları: $${expenses.workerSalaries.toFixed(2)}`,
        `Sigorta Primleri: $${expenses.insurancePremiums.toFixed(2)}`,
        `Yemek Giderleri: $${expenses.mealExpenses.toFixed(2)}`,
        `Kira: $${expenses.rent.toFixed(2)}`,
        `Elektrik: $${expenses.electricity.toFixed(2)}`,
        `Su: $${expenses.water.toFixed(2)}`,
        `İnternet: $${expenses.internet.toFixed(2)}`,
        `Muhasebe: $${expenses.accounting.toFixed(2)}`,
        `Bakım Onarım: $${expenses.maintenance.toFixed(2)}`,
        `Diğer Giderler: $${expenses.other.toFixed(2)}`,
        '------------------------',
        `TOPLAM AYLIK GİDER: $${totalMonthlyExpense.toFixed(2)}`,
        `Aylık Ortalama Sipariş: ${getExpenseValue('monthlyOrders')}`,
        `SİPARİŞ BAŞINA DÜŞEN GİDER: $${expensePerOrder.toFixed(2)}`
    ];

    document.getElementById('expenseDetails').innerHTML = details.join('\n');
} 