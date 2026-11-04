# README — Instalasi Vue 3 + Vite

## 1. Persiapan

Pastikan sudah meng-install:

- Node.js
- npm (biasanya sudah termasuk dalam instalasi Node.js)
- Visual Studio Code

Periksa instalasi melalui terminal:

```bash
node -v
npm -v
```

Jika keduanya menampilkan nomor versi, berarti siap digunakan.

## 2. Membuat Folder Project

Buat folder utama:

```text
Ferry_Booking/
```

Buka folder tersebut menggunakan VS Code.

Buat dua folder di dalamnya:

```text
Ferry_Booking/
│
├── frontend/
│
└── backend/
```

Keterangan:
- `frontend` untuk Vue 3 + Vite.
- `backend` untuk Node.js + Express + SQLite.

## 3. Membuat Project Vue 3

Buka terminal VS Code:

**Terminal → New Terminal**

Masuk ke folder frontend:

```bash
cd frontend
```

Jalankan perintah:

```bash
npm create vite@latest . -- --template vue
```

Keterangan:
- `npm create vite@latest` menjalankan generator Vite terbaru.
- `.` berarti membuat project di folder saat ini.
- `--template vue` memilih template Vue.

## 4. Konfigurasi Project

Vite akan menampilkan beberapa pertanyaan.

**Package name:**

```text
frontend
```

Tekan Enter untuk menggunakan nama tersebut.

**Install with npm and start now?**

Pilih:

```text
Yes
```

Tekan Enter.

Vite akan otomatis:
1. Membuat struktur project Vue.
2. Menginstal dependencies menggunakan npm.
3. Menjalankan development server.

## 5. Struktur Folder Vue

Setelah berhasil dibuat, struktur frontend kurang lebih seperti berikut:

```text
frontend/
│
├── node_modules/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── App.vue
│   ├── main.js
│   └── style.css
│
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

## 6. Menjalankan Vue Development Server

Jika server belum berjalan, pastikan terminal berada di folder `frontend`, kemudian jalankan:

```bash
npm run dev
```

Vite akan memberikan alamat lokal, contohnya:

```text
http://localhost:5173/
```

Buka alamat tersebut di browser.

Jika halaman awal Vue + Vite muncul, berarti instalasi berhasil.

## 7. Menghentikan Development Server

Untuk menghentikan server di terminal:

```text
Ctrl + C
```

## 8. Menjalankan Project Kembali

Setiap kali ingin membuka project:

```bash
cd Ferry_Booking
cd frontend
npm run dev
```

Kemudian buka:

```text
http://localhost:5173/
```

## 9. Teknologi Project Ferry Booking

| Teknologi | Fungsi |
|---|---|
| Vue 3 | Frontend framework |
| Vite | Development server dan build tool |
| Node.js | Backend runtime |
| Express.js | Backend API |
| SQLite | Database |
| Midtrans Sandbox | Simulasi payment gateway |

## 10. Catatan Penting

- Jangan menghapus folder `node_modules` ketika project sedang digunakan.
- File `package.json` menyimpan daftar dependencies dan scripts.
- File `App.vue` merupakan komponen utama aplikasi.
- File `main.js` merupakan entry point aplikasi Vue.
- Vue berkomunikasi dengan database melalui backend API, bukan mengakses file SQLite secara langsung.

**Status:** Vue 3 + Vite berhasil di-install dan development server berhasil dijalankan.


Cara Menjalankan Aplikasi :

cd Backend
node server.js


cd Frontend
npm run dev
http://localhost:5173

