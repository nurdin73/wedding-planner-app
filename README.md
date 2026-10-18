<div align="center">
  <img src="public/icon-192.png" alt="Janji Suci Logo" width="100" style="border-radius: 50%;" />
  <h1>Janji Suci — EverAfter Wedding Planner</h1>
  <p><strong>Aplikasi Web Perencana Pernikahan Modern Editorial Soft Minimalist dengan Kolaborasi Pasangan Real-time.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
    <img src="https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28?logo=firebase&logoColor=black" alt="Firebase" />
    <img src="https://img.shields.io/badge/Zod-4.6-3E67B1?logo=zod&logoColor=white" alt="Zod" />
    <img src="https://img.shields.io/badge/Bun-Fast%20Runtime-FBF0DF?logo=bun&logoColor=black" alt="Bun" />
  </p>
</div>

---

## 💍 Tentang Janji Suci

**Janji Suci** adalah aplikasi perencana pernikahan modern yang dirancang dengan estetika visual **Editorial Soft Minimalist** (menggabungkan tipografi anggun *Cormorant Garamond* dan kejernihan *Plus Jakarta Sans* dalam palet warna hangat `#FAF8F5`, `#3A302C`, serta aksen mawar lembut `#B86B70`).

Aplikasi ini mengedepankan pengalaman bebas stres bagi calon mempelai melalui arsitektur **Offline-First**, validasi form berbasis **Zod** tanpa ketergantungan pada dialog bawaan peramban, serta fitur **Sinkronisasi & Kolaborasi Pasangan Real-time** melalui Cloud Firestore.

---

## ✨ Fitur-Fitur Utama

### 1. 💑 Kolaborasi Pasangan Real-time (Partner Workspace)
- **Ruang Kerja Bersama**: Menghubungkan calon pengantin dalam satu workspace pernikahan terpadu.
- **Kode Pasangan Unik**: Pembuatan kode unik otomatis (format `SUCI-XXXX`).
- **Berbagi Cepat**: Tautan undangan dapat disalin atau langsung dikirimkan melalui WhatsApp.
- **Konfirmasi Terima Undangan**: Halaman khusus (`?invite=SUCI-XXXX`) yang menampilkan pratinjau nama pasangan sebelum memutuskan untuk bergabung.
- **Sinkronisasi 2-Arah**: Setiap perubahan pada checklist, anggaran, maupun tamu langsung tersinkronisasi di kedua perangkat secara realtime.

### 2. ⏳ Hitung Mundur & Barometer 3 Pilar
- **Countdown Hari Bahagia**: Menghitung mundur waktu menuju hari pernikahan secara presisi (Hari, Jam, Menit, Detik).
- **Barometer 3 Pilar**: Ringkasan progres kesiapan pernikahan yang mencakup:
  - Persentase Tugas Terselesaikan
  - Realisasi Anggaran vs Target Budget
  - Total Tamu & Pax Undangan

### 3. ✅ Checklist Tugas Terstruktur
- Pengelompokan tugas berdasarkan fase waktu persiapan:
  - *H-12 s/d H-6 Bulan* (Konsep, Anggaran, Venue Utama)
  - *H-6 s/d H-3 Bulan* (Vendor Katering, Busana, Dokumentasi)
  - *H-3 s/d H-1 Bulan* (Fitting, Undangan, Rundown, Dokumen KUA/Catatan Sipil)
  - *H-1 Bulan s/d Hari H* (Gladi Bersih, Distribusi Souvenir, Finalisasi)
  - *Pasca Acara* (Pengembalian Sewa, Ucapan Terima Kasih)
- Efek selebrasi konfeti pastel saat tugas diselesaikan.

### 4. 💰 Pelacak Anggaran & Pengeluaran (Budget Tracker)
- Manajemen pos biaya berdasarkan kategori (Venue, Katering, Busana & MUA, Dekorasi, Dokumentasi, Hiburan/Musik, Souvenir, dan Lainnya).
- Perbandingan langsung antara Estimasi Biaya vs Pembayaran Aktual.
- **Input Masking Rupiah**: Format angka otomatis (`Rp 15.000.000`) saat mengetik nominal.

### 5. 👥 Pengelola Daftar Tamu (Guest List)
- Kategorisasi tamu: *VIP*, *Keluarga*, *Teman*, *Kolega*.
- Pengelompokan pihak: *Pihak Wanita*, *Pihak Pria*, atau *Bersama*.
- Pencatatan jumlah pax dan pelacakan status undangan (*Terkirim* / *Belum Terkirim*).
- **Input Masking Telepon/WhatsApp**: Pengelompokan nomor otomatis (`0812-3456-7890`).

### 6. 📋 Direktori Vendor & Rundown Hari H
- **Manajemen Vendor**: Menyimpan rincian kontak WhatsApp, akun Instagram, status kerja sama, dan biaya vendor.
- **Susunan Rundown Acara**: Jadwal acara terstruktur per jam, lengkap dengan nama kegiatan, PIC (*Person in Charge*), dan lokasi kegiatan.

### 7. 📸 Generator Story 9:16
- Pembuat kartu infografis kesiapan pernikahan berformat rasio 9:16.
- Menampilkan nama mempelai, hitung mundur hari, dan persentase kesiapan dengan logo resmi Janji Suci.
- Siap diunduh sebagai gambar (*PNG export*) untuk dibagikan ke Instagram Story atau WhatsApp Status.

### 8. 📖 Jurnal Kisah (EverAfter Journal)
- Ruang catatan kenangan dan refleksi emosional perjalanan cinta menuju ikatan suci.

---

## 🛠️ Tech Stack & Arsitektur

| Komponen | Teknologi |
| :--- | :--- |
| **Core Framework** | [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict typing, Zero `any`) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Custom Design Tokens |
| **Authentication** | [Firebase Auth](https://firebase.google.com/products/auth) (Google Sign-In) |
| **Database & Sync** | [Cloud Firestore](https://firebase.google.com/products/firestore) (Offline-First, Realtime Snapshots) |
| **Validasi Form** | [Zod 4](https://zod.dev/) (Strict schemas, Zero HTML `required` attributes) |
| **Input Masking** | Custom Regex Utilities (Currency & Indonesian Phone) |
| **Icons & Visuals** | [Lucide React](https://lucide.dev/), [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti), [html-to-image](https://www.npmjs.com/package/html-to-image) |
| **Package Manager** | [Bun](https://bun.sh/) |

---

## 🚀 Panduan Memulai (Getting Started)

### 1. Prasyarat
Pastikan sistem Anda telah terpasang:
- [Bun](https://bun.sh/) (disarankan) atau [Node.js](https://nodejs.org/) (v18+)
- Proyek Firebase aktif dengan **Authentication** (Google Provider) dan **Cloud Firestore**.

### 2. Kloning Repositori
```bash
git clone https://github.com/nurdin73/wedding-planner-app.git
cd wedding-planner-app
```

### 3. Instalasi Dependensi
```bash
bun install
# atau menggunakan npm:
# npm install
```

### 4. Konfigurasi Lingkungan (.env)
Salin berkas `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Buka file `.env` dan masukkan kredensial dari **Firebase Console** (*Project Settings > General > Your apps*):
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 5. Aturan Keamanan Firestore (Security Rules)
Deploy aturan keamanan Firestore dari file `firestore.rules` melalui Firebase CLI atau langsung di Firebase Console:
```bash
firebase deploy --only firestore:rules
```

### 6. Menjalankan Server Pengembangan
```bash
bun run dev
```
Buka peramban di `http://localhost:5173/`.

### 7. Membangun Bundle Produksi
```bash
bun run build
```

---

## 📂 Struktur Direktori Proyek

```text
wedding-planner/
├── public/                     # Aset publik statis (Favicon, PWA manifest, App icons)
│   ├── apple-touch-icon.png
│   ├── favicon.ico
│   ├── icon-192.png
│   ├── icon-512.png
│   └── manifest.webmanifest
├── src/
│   ├── components/             # Komponen antarmuka modular
│   │   ├── auth/               # Tombol profil & modal autentikasi Google
│   │   ├── budget/             # Dialog tambah/edit biaya & tabel anggaran
│   │   ├── checklist/          # Kartu checklist tugas & filter fase
│   │   ├── collab/             # Dialog ajak pasangan, gabung kode & terima undangan
│   │   ├── guests/             # Dialog tamu & daftar undangan
│   │   ├── home/               # Dashboard, countdown card & barometer progres
│   │   ├── journal/            # Modal catatan kisah cinta
│   │   ├── layout/             # Header aplikasi & navigasi bawah (bottom nav)
│   │   ├── onboarding/         # Modal inisialisasi profil pengantin
│   │   ├── story/              # Generator & preview kartu story 9:16
│   │   ├── ui/                 # Komponen UI bersama (MaskedCurrencyInput, dll)
│   │   └── vendor-rundown/     # Direktori vendor & rundown hari H
│   ├── config/                 # Konfigurasi Firebase App & Firestore SDK
│   ├── context/                # Context provider (Auth & WeddingPlannerContext)
│   ├── hooks/                  # Custom React hooks (useAuth, usePlannerSync, dll)
│   ├── schemas/                # Skema validasi Zod untuk seluruh formulir
│   ├── services/               # Layanan Firestore & kolaborasi pasangan
│   ├── types/                  # Definisi antarmuka TypeScript
│   ├── utils/                  # Utilitas deterministik (mata uang, tanggal, masking, storage)
│   ├── App.tsx                 # Root orchestrator komponen
│   ├── index.css               # Styling dasar & variabel tema Tailwind
│   └── main.tsx                # Titik masuk aplikasi
├── firestore.rules             # Aturan keamanan Cloud Firestore
├── index.html                  # Dokumen HTML utama & referensi font
├── package.json                # Dependensi & skrip proyek
└── tsconfig.json               # Konfigurasi compiler TypeScript
```

---

## 🔒 Kebijakan Keamanan & Kualitas Kode

- **Zero `any`**: Seluruh modul, fungsi, dan komponen menerapkan pengetikan TypeScript yang ketat tanpa fallback ke `any`.
- **Formulir Terstandarisasi**: Semua form divalidasi melalui skema Zod secara deklaratif, menghindari atribut HTML `required` demi konsistensi tampilan pesan kesalahan.
- **Privasi Data**: Kredensial Firebase dikelola melalui variabel lingkungan `.env` dan diabaikan oleh Git via `.gitignore`. Dokumen kerja pengguna dilindungi oleh aturan otorisasi berbasis peran di Firestore Security Rules.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

<div align="center">
  <p>Dibuat dengan segenap cinta untuk mendampingi langkah suci Anda menuju keabadian. ✨</p>
  <p><strong>Janji Suci • EverAfter Planner</strong></p>
</div>
