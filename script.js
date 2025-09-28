// Data transaksi
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Elemen DOM
const balanceAmount = document.getElementById('balance-amount');
const balanceWarning = document.getElementById('balance-warning');
const typeSelect = document.getElementById('type');
const amountInput = document.getElementById('amount');
const descriptionInput = document.getElementById('description');
const dateInput = document.getElementById('date');
const addButton = document.getElementById('add-btn');
const transactionsList = document.getElementById('transactions-list');
const totalIncomeElement = document.getElementById('total-income');
const totalExpenseElement = document.getElementById('total-expense');
const totalSavingElement = document.getElementById('total-saving');
const tabButtons = document.querySelectorAll('.tab-btn');

// Set tanggal default ke hari ini
dateInput.valueAsDate = new Date();

// Fungsi untuk memformat angka ke format Rupiah
function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Fungsi untuk menghitung total berdasarkan jenis transaksi
function calculateTotals() {
    const income = transactions
        .filter(transaction => transaction.type === 'income')
        .reduce((total, transaction) => total + transaction.amount, 0);
    
    const expense = transactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((total, transaction) => total + transaction.amount, 0);
    
    const saving = transactions
        .filter(transaction => transaction.type === 'saving')
        .reduce((total, transaction) => total + transaction.amount, 0);
    
    const balance = income - expense - saving;
    
    return { income, expense, saving, balance };
}

// Fungsi untuk memperbarui tampilan
function updateDisplay() {
    const { income, expense, saving, balance } = calculateTotals();
    
    // Update saldo
    balanceAmount.textContent = formatRupiah(balance);
    if (balance >= 0) {
        balanceAmount.className = 'balance-amount positive';
    } else {
        balanceAmount.className = 'balance-amount negative';
    }
    
    // Tampilkan peringatan jika pengeluaran lebih besar dari pemasukan
    if (expense > income) {
        balanceWarning.style.display = 'block';
    } else {
        balanceWarning.style.display = 'none';
    }
    
    // Update statistik
    totalIncomeElement.textContent = formatRupiah(income);
    totalExpenseElement.textContent = formatRupiah(expense);
    totalSavingElement.textContent = formatRupiah(saving);
    
    // Update daftar transaksi
    updateTransactionList();
    
    // Simpan ke localStorage
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Fungsi untuk memperbarui daftar transaksi
function updateTransactionList() {
    const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
    
    // Filter transaksi berdasarkan tab aktif
    let filteredTransactions = transactions;
    if (activeTab !== 'all') {
        filteredTransactions = transactions.filter(transaction => transaction.type === activeTab);
    }
    
    // Kosongkan daftar transaksi
    transactionsList.innerHTML = '';
    
    // Jika tidak ada transaksi
    if (filteredTransactions.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <p>Tidak ada transaksi ${activeTab !== 'all' ? activeTab : ''} untuk ditampilkan</p>
            <p>Tambahkan transaksi pertama Anda!</p>
        `;
        transactionsList.appendChild(emptyState);
        return;
    }
    
    // Urutkan transaksi berdasarkan tanggal (terbaru di atas)
    filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Tambahkan setiap transaksi ke daftar
    filteredTransactions.forEach(transaction => {
        const transactionItem = document.createElement('div');
        transactionItem.className = 'transaction-item';
        
        // Tentukan kelas untuk jumlah berdasarkan jenis transaksi
        let amountClass = '';
        if (transaction.type === 'income') amountClass = 'income-amount';
        else if (transaction.type === 'expense') amountClass = 'expense-amount';
        else if (transaction.type === 'saving') amountClass = 'saving-amount';
        
        // Format tanggal
        const transactionDate = new Date(transaction.date);
        const formattedDate = transactionDate.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        transactionItem.innerHTML = `
            <div class="transaction-info">
                <div class="transaction-description">${transaction.description}</div>
                <div class="transaction-date">${formattedDate}</div>
            </div>
            <div class="transaction-amount ${amountClass}">${formatRupiah(transaction.amount)}</div>
            <button class="delete-btn" data-id="${transaction.id}">Hapus</button>
        `;
        
        transactionsList.appendChild(transactionItem);
    });
    
    // Tambahkan event listener untuk tombol hapus
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const transactionId = this.getAttribute('data-id');
            deleteTransaction(transactionId);
        });
    });
}

// Fungsi untuk menambah transaksi
function addTransaction() {
    const type = typeSelect.value;
    const amount = parseFloat(amountInput.value);
    const description = descriptionInput.value.trim();
    const date = dateInput.value;
    
    // Validasi input
    if (!amount || amount <= 0) {
        alert('Masukkan jumlah yang valid!');
        return;
    }
    
    if (!description) {
        alert('Masukkan keterangan transaksi!');
        return;
    }
    
    if (!date) {
        alert('Pilih tanggal transaksi!');
        return;
    }
    
    // Buat objek transaksi baru
    const newTransaction = {
        id: Date.now().toString(),
        type,
        amount,
        description,
        date
    };
    
    // Tambahkan ke array transaksi
    transactions.push(newTransaction);
    
    // Reset form
    amountInput.value = '';
    descriptionInput.value = '';
    dateInput.valueAsDate = new Date();
    
    // Perbarui tampilan
    updateDisplay();
    
    // Beri feedback
    alert('Transaksi berhasil ditambahkan!');
}

// Fungsi untuk menghapus transaksi
function deleteTransaction(id) {
    if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
        transactions = transactions.filter(transaction => transaction.id !== id);
        updateDisplay();
    }
}

// Event listener untuk tombol tambah
addButton.addEventListener('click', addTransaction);

// Event listener untuk tab
tabButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Hapus kelas active dari semua tab
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        // Tambahkan kelas active ke tab yang diklik
        this.classList.add('active');
        
        // Perbarui daftar transaksi
        updateTransactionList();
    });
});

// Event listener untuk menekan Enter pada input
descriptionInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTransaction();
    }
});

amountInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTransaction();
    }
});

// Inisialisasi tampilan saat pertama kali dimuat
updateDisplay();