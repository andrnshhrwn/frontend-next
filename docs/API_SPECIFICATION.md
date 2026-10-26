# SPESIFIKASI REST API - SISTEM INFORMASI PENGGANTIAN WATER METER
## PERUMDA AIR MINUM (PAM) TIRTA KAMUNING KABUPATEN KUNINGAN
**Dokumen Versi:** 1.0.0  
**Target Backend Framework:** Node.js (NestJS / Express) atau Go (Gin/Fiber) atau Laravel 11  
**Database:** MySQL 8.0+ / MariaDB 10.5+  
**Format Payload:** `application/json` (Kecuali upload berkas `multipart/form-data`)  
**Standard Timezone:** `Asia/Jakarta` (WIB / UTC+7)

---

## 1. Arsitektur & Konvensi Umum

### 1.1 Base URL
* **Development:** `http://localhost:8000/api/v1`
* **Staging:** `https://staging-api.tirtakamuning.co.id/api/v1`
* **Production:** `https://api.tirtakamuning.co.id/api/v1`

### 1.2 Format Respon Standar (Envelope)

#### Respon Sukses (200 OK / 201 Created)
```json
{
  "status": "success",
  "message": "Data berhasil diambil.",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 10,
    "total_records": 267,
    "total_pages": 27
  }
}
```

#### Respon Gagal (4xx / 5xx)
```json
{
  "status": "error",
  "code": "VALIDATION_FAILED",
  "message": "Validasi input gagal.",
  "errors": [
    {
      "field": "no_seri",
      "message": "Nomor seri WM-26-001201 sudah terdaftar."
    }
  ],
  "timestamp": "2026-08-26T10:15:30+07:00"
}
```

### 1.3 Kode Status HTTP
* `200 OK`: Permintaan berhasil diproses.
* `201 Created`: Entitas baru berhasil dibuat (misal: tambah water meter, buat SPK).
* `400 Bad Request`: Format payload salah atau parameter tidak lengkap.
* `401 Unauthorized`: Token JWT tidak disertakan atau kedaluwarsa.
* `403 Forbidden`: Hak akses role pengguna tidak mencukupi untuk endpoint ini.
* `404 Not Found`: Entitas data tidak ditemukan.
* `409 Conflict`: Terjadi duplikasi data unik (misal: nomor seri water meter, NIP, email).
* `422 Unprocessable Entity`: Validasi aturan bisnis gagal.
* `500 Internal Server Error`: Kesalahan server internal.

---

## 2. Autentikasi & Otorisasi (RBAC)

Autentikasi menggunakan **JWT (JSON Web Token)** Bearer Authentication.  
Header wajib untuk endpoint terproteksi:
```http
Authorization: Bearer <jwt_access_token>
```

### 2.1 Matriks Peran Pengguna (RBAC)
Sistem memiliki 3 level peran (tanpa role pimpinan sesuai PRD v1.3.1):

| Fitur / Modul | Admin Pusat (`admin_pusat`) | Admin Cabang (`admin_cabang`) | Teknisi (`teknisi`) |
| :--- | :---: | :---: | :---: |
| **Dashboard Eksekutif 9 Cabang** | Full Akses (Semua Cabang) | Terbatas ke Unit Sendiri | Tidak Ada |
| **Registrasi Water Meter Baru** | Full Akses | Tidak Ada | Tidak Ada |
| **Alokasi Mutasi WM Antar Unit** | Full Akses | Terbatas Stok Unit Sendiri | Tidak Ada |
| **Master Data (Merk, Tarif, User)** | Full Akses (CRUD) | Baca-Saja | Tidak Ada |
| **Pelanggan & Baseline Gap** | Full Akses | Unit Sendiri | Unit Sendiri |
| **Pembuatan SPK Penugasan** | Full Akses | Unit Sendiri | Tidak Ada |
| **Pelaksanaan & Input BAP Lapangan** | Tidak Ada | Verifikasi Awal | Input & Submit BAP |
| **Validasi & Persetujuan BAP** | Full Akses (Final Approval) | Review Cabang | Tidak Ada |

---

## 3. Daftar Endpoint API

### 3.1 Autentikasi (`/auth`)

#### `POST /auth/login`
Autentikasi akun pengguna menggunakan NIP / Email dan Password.

* **Request Body:**
```json
{
  "identifier": "198804122015031002",
  "password": "PasswordRahasia123!"
}
```
* **Response (200 OK):**
```json
{
  "status": "success",
  "message": "Autentikasi berhasil.",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "def50200...",
    "expires_in": 3600,
    "user": {
      "id_user": 1,
      "nip": "198804122015031002",
      "nama_lengkap": "H. Agus Supriyadi, S.T.",
      "email": "agus.supriyadi@tirtakamuning.co.id",
      "role": "admin_pusat",
      "unit_kerja": {
        "id_unit": 0,
        "nama_unit": "Kantor Pusat Kuningan",
        "kode_unit": "PST"
      }
    }
  }
}
```

#### `GET /auth/me`
Mendapatkan profil pengguna yang sedang login berdasarkan token JWT.
* **Headers:** `Authorization: Bearer <token>`
* **Response (200 OK):** Objek `user` profil lengkap beserta daftar permissions.

#### `POST /auth/refresh`
Memperbarui access token yang telah kedaluwarsa dengan refresh token.
* **Request Body:** `{ "refresh_token": "string" }`
* **Response (200 OK):** Access token dan refresh token baru.

#### `POST /auth/logout`
Melakukan invalidasi token sesi aktif (blacklist token di Redis/Database).

---

### 3.2 Dashboard & Statistik (`/dashboard`)

#### `GET /dashboard/summary`
Mengambil ringkasan metrik penggantian water meter dan status aset.

* **Query Parameters:**
  * `id_unit` (integer, opsional): Filter cabang (wajib diabaikan jika pengguna adalah `admin_cabang`).
  * `periode` (string, opsional, contoh: `2026-08`): Default ke bulan berjalan.

* **Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "periode": "Agustus 2026",
    "target_tahunan": 325,
    "realisasi_penggantian": 267,
    "persentase_realisasi": 82.2,
    "spk": {
      "total": 320,
      "pending": 21,
      "proses": 32,
      "selesai": 267,
      "dibatalkan": 0
    },
    "inventaris_wm": {
      "total": 1840,
      "tersedia_di_unit": 420,
      "terpasang": 1285,
      "rusak": 88,
      "tarik": 47
    }
  }
}
```

#### `GET /dashboard/unit-progress`
Mengambil rekap progres penggantian pada 9 unit cabang PAM Tirta Kamuning.

* **Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    { "id_unit": 1, "nama_unit": "Kuningan", "target": 55, "realisasi": 48, "persentase": 87.3 },
    { "id_unit": 2, "nama_unit": "Cilimus", "target": 50, "realisasi": 42, "persentase": 84.0 },
    { "id_unit": 3, "nama_unit": "Cigugur", "target": 45, "realisasi": 36, "persentase": 80.0 },
    { "id_unit": 4, "nama_unit": "Ciawi", "target": 38, "realisasi": 31, "persentase": 81.6 },
    { "id_unit": 5, "nama_unit": "Luragung", "target": 35, "realisasi": 28, "persentase": 80.0 },
    { "id_unit": 6, "nama_unit": "Kadugede", "target": 32, "realisasi": 25, "persentase": 78.1 },
    { "id_unit": 7, "nama_unit": "Garawangi", "target": 28, "realisasi": 22, "persentase": 78.6 },
    { "id_unit": 8, "nama_unit": "Japara", "target": 22, "realisasi": 18, "persentase": 81.8 },
    { "id_unit": 9, "nama_unit": "Cidahu", "target": 20, "realisasi": 17, "persentase": 85.0 }
  ]
}
```

---

### 3.3 Manajemen Water Meter (`/water-meter`)

#### `GET /water-meter`
Daftar seluruh unit water meter fisik dengan filter dan paginasi.

* **Query Parameters:**
  * `page` (int, default: 1)
  * `limit` (int, default: 10)
  * `search` (string, opsional): Mencari no_seri.
  * `id_unit` (int, opsional): Filter unit cabang.
  * `id_merk` (int, opsional): Filter merk water meter.
  * `status` (string, opsional): `tersedia_di_unit` | `terpasang` | `rusak` | `tarik`.
  * `tahun_pengadaan` (int, opsional): Tahun pengadaan barang.

* **Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "id_wm": "WM-26-001201",
      "no_seri": "WM-26-001201",
      "merk": {
        "id_merk": 1,
        "wm_kode": "ITR",
        "merk_wm": "Itron Aquadis+"
      },
      "ukuran_dn": "1/2",
      "tahun_pengadaan": 2026,
      "status": "tersedia_di_unit",
      "unit_kerja": {
        "id_unit": 1,
        "nama_unit": "Unit Kuningan"
      },
      "pelanggan_aktif": null,
      "created_at": "2026-01-15T08:30:00+07:00"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total_records": 1840,
    "total_pages": 184
  }
}
```

#### `POST /water-meter`
Registrasi water meter satuan baru. (Hanya `admin_pusat`).

* **Request Body:**
```json
{
  "no_seri": "WM-26-001205",
  "id_merk": 1,
  "ukuran_dn": "1/2",
  "tahun_pengadaan": 2026,
  "id_unit": 1
}
```

#### `POST /water-meter/bulk`
Registrasi water meter massal via file CSV atau array JSON.
* **Content-Type:** `multipart/form-data` atau `application/json`
* **JSON Body Alternatif:**
```json
{
  "items": [
    {
      "no_seri": "WM-26-001206",
      "id_merk": 2,
      "ukuran_dn": "1/2",
      "tahun_pengadaan": 2026,
      "id_unit": 1
    }
  ]
}
```

#### `GET /water-meter/:id_wm`
Detail water meter beserta riwayat pemasangan dan mutasi status.

#### `PATCH /water-meter/:id_wm/status`
Pembaruan manual status atau mutasi cabang water meter.
* **Request Body:**
```json
{
  "status": "rusak",
  "catatan": "Rotor aus dan register macet saat pengetesan lab."
}
```

---

### 3.4 Pelanggan & Baseline Data Gap (`/pelanggan`)

#### `GET /pelanggan`
Daftar sambungan langganan (SR) dengan dukungan filter baseline data gap.

* **Query Parameters:**
  * `page`, `limit`, `search` (Nama / No Rekening / ID Pelanggan)
  * `id_unit` (int, opsional)
  * `id_tarif` (string, opsional)
  * `has_wm_aktif` (boolean, opsional): Jika `false`, mengembalikan pelanggan dengan `id_wm_aktif IS NULL` (data gap).

* **Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "id_pelanggan": "PLG-KNG-089211",
      "no_rekening": "101089211",
      "nama_pelanggan": "Bambang Setyawan",
      "alamat": "Jl. Siliwangi No. 120, Kuningan",
      "unit_kerja": {
        "id_unit": 1,
        "nama_unit": "Unit Kuningan"
      },
      "tarif": {
        "id_tarif": "R1",
        "nama_tarif": "Gol. 2A - Rumah Tangga Sederhana"
      },
      "water_meter_aktif": {
        "id_wm": "WM-24-004891",
        "no_seri": "WM-24-004891",
        "merk_wm": "Linflow Multijet",
        "stand_terakhir": 1420
      }
    },
    {
      "id_pelanggan": "PLG-KNG-099412",
      "no_rekening": "101099412",
      "nama_pelanggan": "Dedi Mulyadi",
      "alamat": "Desa Ancaran RT 02/01",
      "unit_kerja": {
        "id_unit": 1,
        "nama_unit": "Unit Kuningan"
      },
      "tarif": {
        "id_tarif": "R1",
        "nama_tarif": "Gol. 2A - Rumah Tangga Sederhana"
      },
      "water_meter_aktif": null
    }
  ]
}
```

#### `POST /pelanggan/:id_pelanggan/link-meter`
Solusi data gap: Mengaitkan meteran fisik terpasang secara langsung setelah verifikasi lapangan tanpa proses penukaran.
* **Request Body:**
```json
{
  "no_seri": "WM-22-009182",
  "stand_awal": 850,
  "catatan": "Hasil sensus verifikasi fisik meteran terpasang di lokasi pelanggan."
}
```

---

### 3.5 Penugasan & SPK Lapangan (`/penugasan`)

#### `GET /penugasan`
Daftar Surat Perintah Kerja (SPK) penggantian water meter.

* **Query Parameters:**
  * `id_unit` (int, opsional)
  * `id_teknisi` (int, opsional)
  * `status` (`pending` | `proses` | `selesai` | `dibatalkan`)
  * `search` (No SPK / Nama Pelanggan)

#### `POST /penugasan`
Membuat tiket / SPK penggantian baru oleh Admin Cabang / Admin Pusat.

* **Request Body:**
```json
{
  "id_pelanggan": "PLG-CLM-091480",
  "alasan_ganti": "Meteran Macet",
  "prioritas": "RUTIN",
  "id_teknisi": 14,
  "catatan": "Pelanggan melapor stand tidak berputar selama 2 bulan berturut-turut."
}
```

#### `PATCH /penugasan/:id_penugasan/assign`
Menugaskan atau mengganti teknisi lapangan penanggung jawab SPK.
* **Request Body:**
```json
{
  "id_teknisi": 15
}
```

---

### 3.6 Validasi & BAP (Berita Acara Penggantian) (`/validasi`)

#### `POST /validasi/submit-lapangan`
Endpoint yang dipanggil oleh aplikasi mobile teknisi setelah penggantian fisik selesai.

* **Content-Type:** `multipart/form-data`
* **Form Fields:**
  * `id_penugasan`: Integer
  * `id_wm_lama`: String (No seri meter lama ditarik)
  * `stand_meter_lama`: Integer (Stand angka meteran lama)
  * `kondisi_fisik_lama`: Enum (`normal` | `macet` | `kaca_pecah` | `berembun_parah` | `bodi_korosi`)
  * `id_wm_baru`: String (No seri meter baru yang dipasang)
  * `stand_meter_baru`: Integer (Stand awal, umumnya 0)
  * `koordinat_gps`: String (`-6.976543, 108.483210`)
  * `foto_wm_lama`: File Image
  * `foto_wm_baru`: File Image
  * `foto_rumah_pelanggan`: File Image
  * `catatan_teknisi`: String

#### `POST /validasi/:id_bap/approve`
Persetujuan BAP oleh Admin Pusat.  
**Aturan Bisnis Otomatis (Database Transaction):**
1. Status BAP diubah menjadi `disetujui`.
2. Status SPK terkait diubah menjadi `selesai`.
3. Status `id_wm_baru` pada tabel `water_meter` diubah menjadi `terpasang`.
4. Status `id_wm_lama` pada tabel `water_meter` diubah menjadi `tarik` atau `rusak`.
5. Kolom `id_wm_aktif` pada tabel `pelanggan` diperbarui ke `id_wm_baru`.

* **Request Body:**
```json
{
  "catatan_persetujuan": "BAP diverifikasi sesuai dokumentasi fisik dan foto lapangan."
}
```

#### `POST /validasi/:id_bap/reject`
Penolakan BAP oleh Admin. Tiket dikembalikan ke teknisi untuk perbaikan.
* **Request Body:**
```json
{
  "alasan_penolakan": "Foto stand meter lama buram, angka meter tidak terbaca jelas."
}
```

#### `GET /validasi/:id_bap/pdf`
Mengunduh dokumen resmi cetak Berita Acara Penggantian (BAP) bertanda tangan digital.

---

### 3.7 Master Data (`/master`)

#### `GET /master/merk-wm`
Daftar seluruh merk water meter aktif (Tabel `merk_wm`).
* Response: Array of `{ id_merk, wm_kode, merk_wm, wm_digit, jumlah_wm }`.

#### `POST /master/merk-wm`
Tambah merk water meter baru.
* Request: `{ "wm_kode": "ITR", "merk_wm": "Itron", "wm_digit": 5 }`.

#### `GET /master/tarif`
Daftar klasifikasi golongan tarif PAM Tirta Kamuning (Tabel `tipe_tarif`).
* Response: Array of `{ id_tarif, nama_tarif, jumlah_pelanggan }`.

#### `POST /master/tarif`
Tambah golongan tarif baru.
* Request: `{ "id_tarif": "R1", "nama_tarif": "Gol. 2A - Rumah Tangga Sederhana" }`.

#### `GET /master/unit-cabang`
Daftar 9 unit cabang kerja PAM Tirta Kamuning + Kantor Pusat.

#### `GET /master/users` & `POST /master/users`
Pengelolaan akun pengguna dengan RBAC dan alokasi unit kerja.

---

## 4. Keamanan & Rate Limiting

1. **CORS:** Dibatasi hanya untuk origin frontend resmi (`https://meter.tirtakamuning.co.id` dan `http://localhost:3000`).
2. **Rate Limiting:**
   * Endpoint login: Maksimal 5 percobaan gagal per 15 menit per IP address.
   * Endpoint API umum: Maksimal 120 permintaan per menit per token JWT.
3. **Audit Log:** Seluruh tindakan persetujuan BAP, mutasi meteran, dan penghapusan master data wajib dicatat di tabel `audit_logs` (User ID, IP, Action, Old Value, New Value, Timestamp).
