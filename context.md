Markdown# Product Requirement Document (PRD)

| Metadata | Detail |
| :--- | :--- |
| **Document Title** | Rancang Bangun Aplikasi Pergantian Water Meter (PAM) |
| **Document Version** | v1.3.1 |
| **Status** | Updated Context (Role Alignment & Real Dataset Agustus 2026) |
| **Author** | Product Manager |
| **Target Audience** | Backend Engineers, Frontend Engineers, Mobile Engineers, UI/UX Designers |
| **Last Updated** | Oktober 2026 |

---

## 1. Executive Summary

### 1.1 Problem Statement
1. **Kurangnya Visibilitas Terpusat:** Belum adanya sistem terpusat bagi Admin Pusat untuk memonitor secara real-time status ketersediaan, pemasangan, dan kondisi fisik Water Meter (WM) yang tersebar di seluruh Unit Cabang.
2. **Pencatatan Stok Cabang Manual:** Admin Cabang kesulitan melakukan registrasi inventori WM yang dialokasikan dari Pusat secara terstruktur dan efisien.
3. **Data Pelanggan Kosong (Baseline Data Gap):** Banyak data pelanggan lama belum memiliki catatan nomor seri WM aktif di database (*legacy data issue*).
4. **Alur Penugasan Kurang Terstruktur:** Tidak adanya sistem berjenjang untuk mendisposisikan tugas penggantian WM dari Admin Pusat ke Admin Cabang hingga ke Teknisi Lapangan.
5. **Kurangnya Evidence Operasional:** Belum ada pencatatan terstandar untuk kondisi fisik WM lama (seperti macet, kaca pecah) beserta bukti foto saat eksekusi penggantian.

### 1.2 Product Vision & Objectives
Membangun platform manajemen inventori, monitoring terpusat, dan operasional penggantian Water Meter berbasis hierarki yang terintegrasi dengan data operasional riil (periode Agustus 2026 dengan total 267 transaksi pergantian di 9 unit cabang aktif).

**Key Performance Indicators (KPIs):**
* **100% Monitoring Data Terpusat:** Admin Pusat dapat memantau seluruh status WM (tersedia di unit, terpasang, rusak, atau ditarik) secara real-time di seluruh unit cabang.
* **Zero Data Orphan:** Penanganan transisi data pelanggan tanpa WM aktif menjadi terdata tanpa menghentikan *workflow* operasional.
* **Auditability:** Setiap eksekusi penggantian mencakup metadata kondisi fisik dan lampiran foto yang terverifikasi.

---

## 2. Target User Persona & Access Control (RBAC)

| Role | Scope Akses | Responsibilitas Utama |
| :--- | :--- | :--- |
| **Admin Pusat** | Global (Pusat & Seluruh Cabang) | Manage master data, memonitor status & inventori seluruh WM secara nasional/global, menerbitkan tiket penugasan global, serta melihat laporan pergantian bulanan (misal: rekapitulasi 267 unit pergantian di bulan Agustus 2026). |
| **Admin Cabang** | Unit Cabang Terkait (Japara, Kuningan, Cilimus, Luragung, Ciawi, Cidahu, Cigugur, Kadugede, Garawangi) | Menginputkan data WM baru yang dialokasikan dari Pusat ke dalam inventori unit cabang, melakukan *plotting*/disposisi teknisi, serta memverifikasi laporan teknisi. |
| **Teknisi** | Assigned Tasks Only (Mobile) | Eksekusi penugasan lapangan, input stand meter, kondisi fisik WM lama, foto bukti, dan verifikasi nomor seri WM baru. |

---

## 3. System Architecture & End-to-End Workflow

[ PHASE 1: REGISTRASI & MONITORING STOK ]Admin Cabang (Input WM Baru dari Pusat) ──► Registered in Unit DB (Status: tersedia_di_unit)│└──► Admin Pusat (Monitoring Data & Stok Global)[ PHASE 2: ALUR PENUGASAN BERJENJANG ]Admin Pusat (Buat Tiket Tugas) ──► Admin Cabang (Assign Teknisi) ──► Status Tiket: proses[ PHASE 3: EKSEKUSI & SINKRONISASI ]Teknisi (Input Data & Foto) ──► Admin Cabang (Verifikasi Pekerjaan) ──► Trigger Auto-Update DB
---

## 4. Technical Data Architecture (Database Schema)

### 4.1 Entity Relationship Diagram Structure

+----------------+       +-------------------+       +-----------------------+|      unit      |       |       user        |       |      water_meter      |+----------------+       +-------------------+       +-----------------------+| PK id_unit     |<------| PK id_user        |       | PK id_water_meter     ||    nama_unit   |       | FK id_unit (NULL) |<------| FK id_unit            |+----------------+       |    username       |       |    serial_number      ||    role           |       | FK id_merk            |+-------------------+       | FK id_user_input      ||    status (ENUM)      |+-----------------------+^+----------------+       +-------------------+                  ||   pelanggan    |       |   penggantian_wm  |                  |+----------------+       +-------------------+                  || PK id_pelanggan|       | PK id_penggantian |                  || FK id_unit     |       | FK id_penugasan   |                  || FK id_wm_aktif |------>| FK id_wm_lama(N)  |------------------++----------------+       | FK id_wm_baru     |------------------'|    kondisi_fisik  |+-------------------+
---

### 4.2 Table Specifications & SQL DDL

#### A. `unit` (Cabang/Unit/Pos)
```sql
CREATE TABLE `unit` (
  `id_unit` INT PRIMARY KEY AUTO_INCREMENT,
  `kode_cabang` VARCHAR(10) NOT NULL,
  `nama_unit` VARCHAR(100) NOT NULL
);
B. tipe_tarifSQLCREATE TABLE `tipe_tarif` (
  `id_tarif` VARCHAR(20) PRIMARY KEY,
  `nama_tarif` VARCHAR(100) NOT NULL
);
C. merk_wmSQLCREATE TABLE `merk_wm` (
  `id_merk` INT PRIMARY KEY AUTO_INCREMENT,
  `wm_kode` VARCHAR(10) NOT NULL,
  `merk_wm` VARCHAR(50) NOT NULL,
  `wm_digit` INT NOT NULL
);
D. user (Disesuaikan tanpa role pimpinan)SQLCREATE TABLE `user` (
  `id_user` INT PRIMARY KEY AUTO_INCREMENT,
  `id_unit` INT NULL,
  `fullname` VARCHAR(100) NOT NULL,
  `username` VARCHAR(50) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin_pusat', 'admin_cabang', 'teknisi') NOT NULL,
  FOREIGN KEY (`id_unit`) REFERENCES `unit`(`id_unit`)
);
E. water_meterSQLCREATE TABLE `water_meter` (
  `id_water_meter` INT PRIMARY KEY AUTO_INCREMENT,
  `id_unit` INT NOT NULL,
  `serial_number` VARCHAR(50) UNIQUE NOT NULL,
  `id_merk` INT NOT NULL,
  `status` ENUM('tersedia_di_unit', 'terpasang', 'rusak', 'tarik') NOT NULL DEFAULT 'tersedia_di_unit',
  `id_user_input` INT NULL,
  `tgl_input` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_unit`) REFERENCES `unit`(`id_unit`),
  FOREIGN KEY (`id_merk`) REFERENCES `merk_wm`(`id_merk`),
  FOREIGN KEY (`id_user_input`) REFERENCES `user`(`id_user`)
);
F. pelangganSQLCREATE TABLE `pelanggan` (
  `id_pelanggan` INT PRIMARY KEY AUTO_INCREMENT,
  `id_unit` INT NOT NULL,
  `nama` VARCHAR(100) NOT NULL,
  `alamat` VARCHAR(255) NOT NULL,
  `id_tarif` VARCHAR(20) NOT NULL,
  `id_wm_aktif` INT NULL, -- NULLABLE: Handles legacy/unmapped active meters
  FOREIGN KEY (`id_unit`) REFERENCES `unit`(`id_unit`),
  FOREIGN KEY (`id_tarif`) REFERENCES `tipe_tarif`(`id_tarif`),
  FOREIGN KEY (`id_wm_aktif`) REFERENCES `water_meter`(`id_water_meter`)
);
G. penugasanSQLCREATE TABLE `penugasan` (
  `id_penugasan` INT PRIMARY KEY AUTO_INCREMENT,
  `id_pelanggan` INT NOT NULL,
  `id_unit` INT NOT NULL,
  `tgl_penugasan` DATETIME NOT NULL,
  `alasan` VARCHAR(255) NOT NULL,
  `id_user_penugasan` INT NOT NULL,
  `status` ENUM('pending', 'proses', 'selesai', 'dibatalkan') NOT NULL DEFAULT 'pending',
  FOREIGN KEY (`id_pelanggan`) REFERENCES `pelanggan`(`id_pelanggan`),
  FOREIGN KEY (`id_unit`) REFERENCES `unit`(`id_unit`),
  FOREIGN KEY (`id_user_penugasan`) REFERENCES `user`(`id_user`)
);
H. penggantian_wmSQLCREATE TABLE `penggantian_wm` (
  `id_penggantian` INT PRIMARY KEY AUTO_INCREMENT,
  `id_penugasan` INT NOT NULL,
  `id_wm_lama` INT NULL, -- NULLABLE: Support initial migration flow
  `stand_wm_lama` INT NULL,
  `kondisi_fisik_wm_lama` ENUM('normal', 'macet', 'kaca_pecah', 'berembun_parah', 'bodi_korosi') NOT NULL,
  `path_image_wm_lama` VARCHAR(255) NULL,
  `id_wm_baru` INT NOT NULL,
  `stand_awal_wm_baru` INT NOT NULL DEFAULT 0,
  `path_image_wm_baru` VARCHAR(255) NOT NULL,
  `id_teknisi` INT NOT NULL,
  `tgl_penggantian` DATETIME NOT NULL,
  `verified` BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (`id_penugasan`) REFERENCES `penugasan`(`id_penugasan`),
  FOREIGN KEY (`id_wm_lama`) REFERENCES `water_meter`(`id_water_meter`),
  FOREIGN KEY (`id_wm_baru`) REFERENCES `water_meter`(`id_water_meter`),
  FOREIGN KEY (`id_teknisi`) REFERENCES `user`(`id_user`)
);
5. Non-Functional Requirements (NFR)Performance: Maximum API response time $< 500\text{ ms}$ for reporting queries under a load of 1,000 concurrent requests[cite: 1].Data Integrity & Transactions: The execution verification step must be wrapped inside a Database Transaction (ACID). If updating pelanggan.id_wm_aktif fails, status changes on water_meter must roll back[cite: 1].Security: Role-Based Access Control (RBAC) enforced at API level; image uploads validated for file type (jpg, jpeg, png) and compressed to maximum $2\text{ MB}$[cite: 1].Availability: 99.9% uptime requirement[cite: 1].6. UI DesignAdmin Pusat (Web):Dashboard Monitoring Water Meter: Halaman overview berisi statistik visual ketersediaan dan status WM per unit cabang serta ekspor laporan bulanan[cite: 1].Halaman pembuatan penugasan dan verifikasi global[cite: 1].Admin Cabang (Web):Form Input Data Water Meter Baru: Halaman form khusus (single/batch upload) bagi Admin Cabang untuk mendaftarkan stok WM baru dari Pusat ke database unit cabang[cite: 1].Halaman penerimaan tiket, disposisi teknisi, dan verifikasi hasil pekerjaan lapangan[cite: 1].Teknisi (Mobile):Aplikasi mobile untuk pencatatan pergantian WM di lapangan (input SN WM lama & baru, stand meter, kondisi fisik, dan foto bukti)[cite: 1].7. Teknologi AplikasiFrontend: Next.js dan Tailwind CSS[cite: 1].Backend: Express.js, Prisma ORM, dan database MySQL/PostgreSQL[cite: 1].