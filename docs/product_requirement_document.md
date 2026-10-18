# Product Requirement Document (PRD)

## Aplikasi Web Wedding Planner: "Janji Suci" (EverAfter Planner)

| Metadata | Keterangan | 
| ----- | ----- | 
| **Nama Proyek** | Janji Suci Web App (EverAfter Planner) | 
| **Kategori** | Productivity, Event Planning & Social Experience Web App | 
| **Platform Target** | Web App (Mobile-First Responsive Web / PWA-ready) | 
| **Versi Dokumen** | 2.0.0 (Modern Editorial Aesthetic & Clean Minimalist) | 
| **Status** | *Approved for Implementation* | 
| **Tanggal Pembaruan** | Oktober 2026 | 

## 1. Ringkasan Eksekutif & Visi Produk

### 1.1 Latar Belakang

Mempersiapkan pernikahan sering kali menjadi proses yang membingungkan dan melelahkan (*stressful*) bagi calon pengantin. Rincian persiapan yang berserakan di spreadsheet kaku, obrolan WhatsApp, dan catatan fisik kerap memicu miskomunikasi serta anggaran membengkak. Di sisi lain, aplikasi perencana pernikahan yang ada di pasaran sering kali memiliki antarmuka yang terlalu ramai, kekanak-kanakan, atau berat secara visual. Pengguna modern mendambakan ruang digital yang bersih, tenang, rapi, dan memberikan kenyamanan visual layaknya membuka majalah pernikahan (*bridal editorial journal*) premium di ponsel pintar mereka.

### 1.2 Visi Produk

Menyediakan aplikasi web perencana pernikahan yang **intuitif, rapi, estetik, dan menenangkan (*stress-free*) dengan pendekatan *mobile-first***.

Aplikasi mengusung bahasa visual **Modern Editorial Soft Minimalist**:

* Desain kartu datar (*clean flat layout*) berpadu dengan aksen kaca buram tipis (*subtle frosted glass*).

* Garis tepi sehalus helai rambut (*hairline borders*) dan bayangan lembut menyebar (*ambient soft glow*), meniadakan elemen timbul 3D/clay yang tebal agar tampilan tetap ramping, rapi, dan elegan.

* **Seluruh penanda visual menggunakan pustaka resmi Lucide Icons** (meniadakan emoji sistem yang inkonsisten).

* **Tipografi editorial berpasangan harmonis** (*Cormorant Garamond* & *Plus Jakarta Sans*).

* Kemudahan **Google One-Tap SSO**, **Alokasi Kuota Tamu & Estimasi Pax** tanpa kerumitan tracking RSVP, serta **Generator Kartu Story Estetik (9:16)** untuk berbagi momen persiapan ke media sosial.

## 2. Target Pengguna (User Persona)

### 2.1 Persona Utama: *The Aesthetic & Organized Bride-to-Be*

* **Profil:** Sarah (26 tahun) & Dimas (28 tahun), pasangan urban profesional yang mandiri merencanakan pernikahan mereka.

* **Kebutuhan Emosional & Estetika:**

  * Menyukai desain minimalis, rapi, dan bernuansa editorial majalah (*Kinfolk/Cereal magazine vibe*).

  * Menghindari tampilan yang terlalu tebal, timbul (*clay/3D*), atau kekanak-kanakan; menginginkan kesan dewasa, anggun, dan lapang (*airy whitespace*).

  * Ingin kepastian alokasi kuota tamu keluarga pria vs wanita dan estimasi katering tanpa direpotkan konfirmasi kehadiran yang belum final.

  * Ingin membagikan momen kesiapan pernikahan (*milestone story*) dengan tata letak visual elegan ke Instagram Story atau WhatsApp Status.

* **Perilaku Digital:**

  * 90% waktu interaksi berlangsung di layar smartphone.

  * Memerlukan akses instan tanpa formulir registrasi panjang (Google Sign-In).

## 3. Spesifikasi Desain Visual: Modern Editorial Soft Minimalist

```
┌─────────────────────────────────────────────────────────────────┐
│                    STRUKTUR VISUAL MINIMALIS                    │
│                                                                 │
│  [Latar: Soft Cream / Warm Linen #FAF8F5]                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Kartu Bersih (Flat Crisp Card):                           │  │
│  │ • Latar Putih Bersih / Frosted Blur (#FFFFFF / 90% Opac)  │  │
│  │ • Garis Batas Halus: 1px border border-[#EFE8E1]         │  │
│  │ • Bayangan Melayang Tipis: shadow-sm (ambient glow)       │  │
│  │ • Lucide Icon Tipis (1.5px - 1.75px)                      │  │
│  │ • Tipografi Editorial: Serif Mewah + Sans Bersih         │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

```

### 3.1 Filosofi Desain

* **Datar, Ramping & Bernapas (*Flat & Airy*):** Tidak ada tombol menggelembung atau bayangan tebal. Semua elemen berada dalam bidang datar yang anggun dengan ruang kosong (*whitespace*) yang proporsional.

* **Sentuhan Kaca Buram (*Frosted Glass Accents*):** Header dan navigasi bawah menggunakan latar semitransparan dengan *backdrop blur* halus untuk kesan modern dan ringan saat digulir.

* **Batas Garis Rambut (*Hairline Borders*):** Pemisah antar elemen menggunakan garis 1px bernuansa *warm stone/blush neutral* yang sangat lembut sehingga terkesan rapi dan tertata presisi.

### 3.2 Sistem Tipografi Harmonis (Editorial Typography Pairing)

1. **Heading & Elemen Puitis: *Cormorant Garamond***

   * **Karakter:** Serif klasik kontemporer dengan lekukan organik yang anggun, memberikan nuansa kartu undangan premium.

   * **Penggunaan:** Nama mempelai, judul seksi, hitung mundur utama, dan kutipan romantis (*quotes*).

   * **Atribut:** `font-serif`, huruf besar diberi jarak tipis (*letter-spacing: tracking-wide*).

2. **Body Text, Tombol, Label & Angka: *Plus Jakarta Sans***

   * **Karakter:** Sans-serif modern berbobot proporsional, berkarakter tegas dan sangat mudah dibaca (*high legibility*) di layar ponsel berukuran kecil.

   * **Penggunaan:** Label tombol, teks isian form, checklist tugas, rincian biaya, dan navigasi.

   * **Atribut Angka (*Tabular Numbers*):** Menerapkan `font-variant-numeric: tabular-nums;` agar kalkulasi angka rupiah dan timer detik tidak bergeser saat nilai berubah.

### 3.3 Standar Ikonografi Wajib (Lucide Icons Standard)

* **Bebas Raw Emoji:** Seluruh antarmuka dilarang menggunakan karakter emoji bawaan sistem operasi.

* **Pustaka Resmi:** Menggunakan **Lucide Icons** (`lucide-react` atau pustaka web resmi).

* **Karakter Garis:** Ketebalan garis seragam pada `1.75px` dengan ujung membulat (*stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"*).

* **Warna Ikon:** Disesuaikan secara monokromatik lembut mengikuti tema: Dusty Rose (`#B86B70`), Sage Dark (`#58755E`), Soft Mocha (`#7E6E67`), dan Muted Taupe.

| Kebutuhan Visual | Ikon Lucide | Penempatan | 
| ----- | ----- | ----- | 
| Brand / Logo | `Sparkles` / `HeartHandshake` | App bar & cover header | 
| Hitung Mundur | `CalendarHeart` / `Hourglass` | Kartu tanggal Hari-H | 
| Checklist & Progres | `CheckCircle2` / `ListTodo` | Modul tugas persiapan | 
| Pengeluaran & Anggaran | `WalletCards` / `Coins` | Modul kalkulasi biaya | 
| Alokasi Tamu & Kuota | `Users` / `UserCheck` | Modul daftar tamu & pax | 
| Pihak Wanita / Pria | `Heart` / `Users2` | Penanda asal undangan pengantin | 
| Kategori VIP | `Crown` | Penanda tamu kehormatan | 
| Status Kirim Undangan | `Send` / `MailCheck` | Distribusi undangan (Terkirim / Belum) | 
| Rekanan Vendor | `Store` / `Building2` | Modul direktori vendor | 
| Jadwal Hari-H | `Clock` / `Milestone` | Rundown acara pernikahan | 
| Generator Berbagi | `Share2` / `Instagram` | Tombol export story & share | 
| Aksi Hapus | `Trash2` | Menghapus item catatan | 

### 3.4 Palet Warna Lembut & Elegan (Neutral Soft Palette)

* **Background Utama:** Warm Linen Cream (`#FAF8F5`)

* **Background Kartu:** Pure White (`#FFFFFF`) & Off-White Oat (`#F5EFEB`)

* **Garis Batas (Border):** Subtle Oat Line (`#ECE5DE`) & Soft Blush Line (`#F2DFDC`)

* **Aksen Warna Lembut:**

  * *Dusty Rose:* `#B86B70` (primer: tombol utama, badge highlight)

  * *Soft Rose Tint:* `#FDF0EE` (latar tag lembut)

  * *Soft Sage:* `#E8F0EA` & *Sage Dark:* `#58755E` (indikator seimbang/selesai)

  * *Champagne Sand:* `#DFB15B` (aksen VIP)

* **Warna Teks:**

  * *Heading / Primary Text:* Dark Espresso Charcoal (`#3A302C`)

  * *Body / Secondary Text:* Soft Cocoa (`#73635C`)

  * *Muted / Subtle Hint:* Warm Stone (`#A89B95`)

## 4. Arsitektur Informasi & Navigasi Mobile-First

Aplikasi menggunakan layout vertikal satu kolom yang dioptimalkan untuk layar ponsel pintar dengan navigasi bawah mengambang yang bersih:

```
[ Top Bar: Logo Minimalis | Nama Pasangan | Tombol Akun Google ]
       ↓
[ Area Konten Bergulir Vertikal ]
       ├─ Header & Live Countdown (Kartu Minimalis Editorial)
       ├─ Ringkasan Cepat: Checklist % | Budget Sisa | Total Pax
       └─ Tab Konten Terpilih (Home / Checklist / Budget / Tamu / Vendor & Rundown)
       ↓
[ Floating Aesthetic Action: Tombol "Bagikan Progres" (Share2) ]
       ↓
[ Bottom Navigation Bar: Frosted Glass dengan Ikon Lucide Ramping ]

```

## 5. Rincian Modul & Kebutuhan Fungsional

### Modul 0: Akses Masuk Instan (Seamless Authentication)

* **FR-0.1 Google One-Tap SSO:** Masuk sekali klik menggunakan akun Google tanpa kata sandi.

* **FR-0.2 Guest Explorer Mode:** Calon pengantin dapat langsung merancang rencana tanpa login awal; data otomatis tersimpan di peramban (`localStorage`) dan dapat ditautkan ke akun Google nanti.

* **FR-0.3 Sinkronisasi Bersama Pasangan:** Tautan unik untuk menghubungkan akun pasangan ke lembar kerja yang sama.

### Modul 1: Beranda & Editorial Countdown

* **FR-1.1 Kartu Hitung Mundur Rapi:** Menampilkan sisa hari, jam, menit, dan detik dalam balutan kartu minimalis elegan dengan angka `tabular-nums` yang rapi.

* **FR-1.2 Quotes Puitis Pernikahan:** Kutipan inspiratif bertipografi serif klasik di bagian bawah kartu nama mempelai.

* **FR-1.3 Barometer Progres Tiga Pilar:**

  * Persentase tugas selesai (ikon `CheckCircle2`).

  * Realisasi anggaran vs plafon pagu (ikon `WalletCards`).

  * Total alokasi kuota tamu & proyeksi porsi katering / Pax (ikon `Users`).

### Modul 2: Checklist & Linimasa Persiapan

* **FR-2.1 Filter Fase Waktu Bersih:** Tombol kapsul tipis (*pill outline buttons*) berlabel: *Semua, H-12 s/d H-6 Bulan, H-3 Bulan, H-1 Bulan, H-7 Hari, Hari-H*.

* **FR-2.2 Checkbox Minimalis:** Kotak centang elegan dengan transisi warna lembut dan efek konfeti pastel saat tugas diselesaikan.

* **FR-2.3 Manajemen Tugas:** Formulir cepat untuk menambah dan menghapus daftar persiapan.

### Modul 3: Pelacak Anggaran & Pengeluaran (Budget Tracker)

* **FR-3.1 Ringkasan Saldo Finansial:** Menampilkan Total Pagu Anggaran, Total Terbayar, dan Sisa Dana secara terstruktur rapi.

* **FR-3.2 Progress Bar Ramping:** Indikator bar tipis (`h-1.5` atau `h-2`) dengan gradasi warna lembut yang mengalir tenang.

* **FR-3.3 Pengelompokan Kategori:** Visualisasi pengeluaran per kategori (Venue & Katering, MUA & Busana, Dekorasi, Dokumentasi, Undangan & Souvenir, Lainnya).

### Modul 4: Daftar Tamu & Alokasi Kuota (Guest Allocation & Pax)

*(Fokus pada pembagian kuota yang realistis, tanpa tracking RSVP yang sulit diverifikasi).*

* **FR-4.1 Ringkasan Alokasi:**

  * Menampilkan total kuota undangan dan proyeksi kebutuhan porsi katering (Pax).

  * Pembagian porsi undangan antara pihak Pengantin Wanita vs Pengantin Pria.

* **FR-4.2 Manajemen Tamu Bersih:**

  * Mencatat nama tamu / keluarga, jumlah pax (1–10 pax), dan kategori relasi (Keluarga, Sahabat, Rekan Kerja, VIP).

  * Penanda pihak pengundang (Mempelai Wanita / Pria).

  * Penanda status distribusi undangan fisik/digital sederhana (*Sudah Dikirim / Belum Dikirim*) menggunakan ikon Lucide `Send`.

### Modul 5: Direktori Vendor & Susunan Acara (Rundown Hari-H)

* **FR-5.1 Direktori Rekanan:** Daftar mitra vendor pernikahan, kontak WhatsApp/Instagram, kisaran biaya, dan status kontrak (DP / Lunas).

* **FR-5.2 Linimasa Acara Hari-H:** Susunan acara jam per jam dengan garis vertikal tipis, penanggung jawab sesi (PIC), dan catatan teknis pelaksanaan.

### Modul 6: Fitur Berbagi & Generator Story Medsos (Share & Experience)

* **FR-6.1 Aesthetic Story Card Generator (Format Vertikal 9:16):**

  * Mengonversi pencapaian persiapan menjadi gambar kartu vertikal estetik bertema majalah editorial.

  * Memuat nama pasangan, sisa hari menuju akad/resepsi, persentase kesiapan, dan kutipan cinta tanpa emoji sistem yang berantakan.

  * Tombol unduh gambar atau bagikan langsung via Web Share API ke Instagram Story dan WhatsApp Status.

* **FR-6.2 Bagikan Ringkasan Rundown:** Salin susunan acara Hari-H ke format teks terstruktur rapi untuk dikirimkan ke grup panitia keluarga via WhatsApp.

* **FR-6.3 Wedding Journal & Experience Review:** Tempat mencatat cerita berkesan selama proses persiapan untuk dibagikan sebagai tips kepada calon pengantin lainnya.

## 6. K