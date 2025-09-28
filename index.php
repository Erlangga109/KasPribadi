<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Penghitung Keuangan Harian</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Penghitung Keuangan Harian</h1>
            <p>Kelola pemasukan, pengeluaran, dan tabungan Anda</p>
        </header>

        <!-- Kartu Saldo -->
        <div class="balance-card">
            <h2>Saldo Saat Ini</h2>
            <div id="balance-amount" class="balance-amount positive">Rp 0</div>
            <div id="balance-warning" class="warning">
                ⚠️ Peringatan: Pengeluaran lebih besar dari pemasukan!
            </div>
        </div>

        <!-- Form Input Data -->
        <div class="form-section">
            <div class="form-group">
                <label for="type">Jenis Transaksi</label>
                <select id="type">
                    <option value="income">Pemasukan</option>
                    <option value="expense">Pengeluaran</option>
                    <option value="saving">Tabungan</option>
                </select>
            </div>

            <div class="form-group">
                <label for="amount">Jumlah (Rp)</label>
                <input type="number" id="amount" placeholder="Masukkan jumlah">
            </div>

            <div class="form-group">
                <label for="description">Keterangan</label>
                <input type="text" id="description" placeholder="Dari mana/Untuk apa">
            </div>

            <div class="form-group">
                <label for="date">Tanggal</label>
                <input type="date" id="date">
            </div>

            <div class="form-group">
                <label>&nbsp;</label>
                <button id="add-btn">Tambah Transaksi</button>
            </div>
        </div>

        <!-- Tab untuk beralih antara daftar transaksi -->
        <div class="tabs">
            <button class="tab-btn active" data-tab="all">Semua Transaksi</button>
            <button class="tab-btn" data-tab="income">Pemasukan</button>
            <button class="tab-btn" data-tab="expense">Pengeluaran</button>
            <button class="tab-btn" data-tab="saving">Tabungan</button>
        </div>

        <!-- Daftar Transaksi -->
        <div class="transactions-section">
            <h3>Daftar Transaksi</h3>
            <div id="transactions-list" class="transactions-list">
                <!-- Transaksi akan ditampilkan di sini -->
            </div>
        </div>

        <!-- Statistik -->
        <div class="stats-section">
            <div class="stat-card income">
                <h4>Total Pemasukan</h4>
                <div id="total-income">Rp 0</div>
            </div>
            <div class="stat-card expense">
                <h4>Total Pengeluaran</h4>
                <div id="total-expense">Rp 0</div>
            </div>
            <div class="stat-card saving">
                <h4>Total Tabungan</h4>
                <div id="total-saving">Rp 0</div>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>