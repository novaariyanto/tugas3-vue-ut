# Sistem Pemesanan Bahan Ajar - Universitas Terbuka

Aplikasi web untuk mengelola stok bahan ajar dan tracking delivery order (DO) di Universitas Terbuka. Dibangun menggunakan Vue.js 2 dengan arsitektur komponen yang modular.

## 📋 Fitur Utama

### 1. Stok Bahan Ajar
- **CRUD (Create, Read, Update, Delete)** data bahan ajar
- **Filter** berdasarkan:
  - UT-Daerah
  - Kategori Mata Kuliah (dinamis berdasarkan UT-Daerah yang dipilih)
  - Stok menipis/kosong
- **Sort** berdasarkan:
  - Judul
  - Jumlah Stok
  - Harga
- **Status Badge** dengan indikator warna:
  - Hijau: Stok aman (qty > safety stock)
  - Kuning: Stok menipis (qty ≤ safety stock)
  - Merah: Stok kosong (qty = 0)
- **Tooltip** untuk menampilkan catatan HTML pada status badge
- **Format currency** dan quantity yang rapi

### 2. Tracking Delivery Order (DO)
- **Tambah DO baru** dengan informasi:
  - Nomor DO (auto-generate)
  - NIM dan Nama mahasiswa
  - Ekspedisi pengiriman
  - Paket bahan ajar (dengan preview detail)
  - Tanggal kirim
  - Total harga (otomatis dari paket)
- **Pencarian DO** berdasarkan:
  - Nomor DO
  - NIM
- **Tracking Progress** pengiriman dengan kemampuan:
  - Menampilkan riwayat perjalanan
  - Menambah status progress baru
- **Format tanggal** dan currency yang konsisten

## 🛠️ Teknologi yang Digunakan

- **Vue.js 2.6.14** - Framework JavaScript untuk UI
- **Vanilla JavaScript** - Tanpa build tools
- **HTML5 & CSS3** - Struktur dan styling
- **JSON** - Penyimpanan data

## 📁 Struktur Proyek

```
tugas3/
├── assets/
│   ├── css/
│   │   └── style.css          # Styling aplikasi
│   └── img/                   # Gambar/assets
├── data/
│   └── dataBahanAjar.json     # Data bahan ajar, tracking, dan konfigurasi
├── js/
│   ├── app.js                 # Root Vue instance dan modal handler
│   ├── services/
│   │   └── api.js             # Service untuk fetch data dari JSON
│   └── components/
│       ├── app-modal.js       # Komponen modal konfirmasi
│       ├── do-tracking.js     # Komponen tracking DO
│       ├── status-badge.js    # Komponen badge status stok
│       └── stock-table.js     # Komponen tabel stok bahan ajar
└── index.html                 # File HTML utama
```

## 🚀 Cara Menjalankan

1. **Clone atau download** repository ini
2. **Buka** file `index.html` di browser web modern
   - Atau gunakan local server (misalnya Live Server di VS Code)
   - Atau jalankan dengan Python: `python -m http.server 8000`
3. **Akses** aplikasi di browser:
   - Jika menggunakan file://: buka langsung `index.html`
   - Jika menggunakan server: `http://localhost:8000`

## 📝 Format Data

Data disimpan dalam file `data/dataBahanAjar.json` dengan struktur:

```json
{
  "upbjjList": ["Jakarta", "Surabaya", ...],
  "kategoriList": ["MK Wajib", "MK Pilihan", ...],
  "pengirimanList": [
    {"kode": "REG", "nama": "Reguler (3-5 hari)"},
    ...
  ],
  "paket": [
    {
      "kode": "PAKET-UT-001",
      "nama": "PAKET IPS Dasar",
      "isi": ["EKMA4116", ...],
      "harga": 150000
    },
    ...
  ],
  "stok": [
    {
      "kode": "EKMA4116",
      "judul": "Manajemen",
      "kategori": "MK Wajib",
      "upbjj": "Jakarta",
      "lokasiRak": "A-01",
      "harga": 50000,
      "qty": 100,
      "safety": 20,
      "catatanHTML": "<strong>Catatan:</strong> ..."
    },
    ...
  ],
  "tracking": [
    {
      "nim": "123456789",
      "nama": "Nama Mahasiswa",
      "ekspedisi": "Reguler (3-5 hari)",
      "paket": "PAKET-UT-001",
      "tanggalKirim": "2024-01-15",
      "total": 150000,
      "status": "Dalam Perjalanan",
      "perjalanan": [
        {
          "waktu": "2024-01-15 10:00",
          "keterangan": "Paket diterima di gudang"
        },
        ...
      ]
    },
    ...
  ]
}
```

## 🎨 Komponen Vue

### `ba-stock-table`
Komponen utama untuk mengelola stok bahan ajar dengan fitur CRUD, filter, dan sort.

### `do-tracking`
Komponen untuk tracking delivery order dengan kemampuan pencarian dan update progress.

### `status-badge`
Komponen badge yang menampilkan status stok dengan tooltip untuk catatan.

### `app-modal`
Komponen modal untuk konfirmasi aksi (seperti delete).

## ⌨️ Keyboard Shortcuts

- **Enter** pada form: Submit form
- **Esc** pada pencarian DO: Reset pencarian

## 📌 Catatan Penting

- Data disimpan di `data/dataBahanAjar.json` - pastikan file ini dapat diakses
- Aplikasi ini menggunakan **Vue.js 2** (CDN), tidak memerlukan build process
- Pastikan browser mendukung **ES6+** dan **Fetch API**
- Untuk production, pertimbangkan menggunakan backend API untuk menyimpan data

## 🔧 Pengembangan

### Menambah Fitur Baru

1. Buat komponen Vue baru di `js/components/`
2. Daftarkan komponen di `index.html` sebelum `app.js`
3. Tambahkan template di `index.html` jika diperlukan
4. Gunakan `DataService.fetchData()` untuk mengakses data

### Modifikasi Data

Edit file `data/dataBahanAjar.json` sesuai kebutuhan. Pastikan format JSON valid.

## 📄 Lisensi

Proyek ini dibuat untuk keperluan tugas akademik.

## 👤 Author

Dibuat untuk Tugas 3 - Sistem Pemesanan Bahan Ajar Universitas Terbuka

