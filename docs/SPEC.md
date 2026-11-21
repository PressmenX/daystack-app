# Daystack: Spesifikasi Produk

| | |
|---|---|
| App Name | Daystack |
| Document Version | 0.10 (draf) |
| App Version | 1.0.0 |
| Updated | 21 November 2026 |
| Platform | Web responsif (mobile-first) |
| UI Language | Indonesia |
| Tech stack: Frontend | Vite, React, TypeScript, Tailwind CSS, daisyUI, React Hook Form, React Router, Lucide React, Supabase JS (`@supabase/supabase-js`), dnd-kit |
| Tech stack: Backend | Supabase |

## 1. Deskripsi App

Daystack adalah aplikasi untuk menyusun rutinitas harian dalam bentuk urutan aktivitas, terinspirasi dari konsep habit stacking. Pengguna menyusun aktivitas secara berurutan dalam sebuah rutinitas, melihatnya sebagai timeline, dan pada mode checklist menandai aktivitas yang telah selesai.

### 1.1 Pengguna

Satu peran: pengguna terdaftar. Setiap pengguna hanya dapat mengakses data miliknya sendiri.

## 2. Fitur

### 2.1 MVP 1

- Login dan register akun
- Global Routines
- Tampilan timeline
- Card Progress
- Tambah, ubah, dan hapus Activity
- Pengaturan urutan Activity

### 2.2 MVP 2

- Custom Routines
- Pilihan jenis Activity saat menambah (Standar, With Time)

### 2.3 Lanjutan

- Decision Block
- Condition Block
- Push notifikasi dan reminder
- Keterkaitan pemicu antar Activity

## 3. Penjelasan Fitur

### 3.1 Istilah

| Istilah | Definisi |
|---|---|
| Routines | Kelompok (folder) yang berisi sejumlah Activity yang tersusun berurutan. |
| Global Routines | Routines bawaan aplikasi yang ditampilkan di dasbor. Selalu berada pada mode checklist. |
| Custom Routines | Routines buatan pengguna, misalnya Morning Routines, Night Routines, atau Weekend Routines. |
| Mode checklist | Activity dapat dicentang sebagai selesai. |
| Mode non-checklist | Activity hanya ditampilkan sebagai timeline dan tidak dapat dicentang. Ini adalah mode bawaan untuk Routines selain Global. |
| Activity | Blok aktivitas dalam sebuah Routines. |

### 3.2 Autentikasi

1. Pengguna WAJIB dapat mendaftar dan login menggunakan email dan password melalui Supabase Auth.
2. Dasbor WAJIB hanya dapat diakses setelah login.
3. Pengguna yang belum login WAJIB diarahkan ke halaman login.

### 3.3 Routines

**Global Routines**

1. Aplikasi WAJIB menyediakan satu Global Routines untuk setiap pengguna, dengan mode checklist.
2. Global Routines WAJIB dibuat otomatis saat registrasi dengan daftar Activity kosong.
3. Global Routines WAJIB ditampilkan di dasbor dalam bentuk timeline.

**Custom Routines**

1. Pengguna WAJIB dapat membuat Custom Routines dengan field berikut:
   - Nama (wajib).
   - Waktu terjadi (opsional).
   - Jenis: checklist atau non-checklist (wajib).
2. Custom Routines berjalan pada mode sesuai jenis yang dipilih.

### 3.4 Activity

**Field**

| Field | Ketentuan |
|---|---|
| Nama | Wajib. |
| Jam mulai | Opsional, kecuali pada Time Activity. Hanya berfungsi sebagai tampilan. |
| isCompleted | Opsional. Hanya berlaku pada Routines mode checklist. |

**Jenis Activity**

| Jenis | Ketentuan |
|---|---|
| Default Activity | Hanya nama yang wajib. Field lain boleh dikosongkan. |
| Time Activity | Jam mulai wajib, karena aktivitas membutuhkan waktu yang pasti. |
| Decision Block | Lihat Bagian 3.7. |

**Form Add Activity**

Form Add memuat seluruh field Activity. Tombol Add menampilkan pilihan jenis Activity (Standar, With Time).

**Perilaku status selesai**

1. Status selesai hanya berubah melalui tindakan pengguna (mencentang atau membatalkan centang).
2. Status selesai TIDAK direset otomatis, termasuk saat pergantian hari.
3. Jam mulai tidak memengaruhi status selesai.

**Pengelolaan Activity**

1. Pengguna WAJIB dapat mengubah dan menghapus Activity.
2. Pengguna WAJIB dapat mengubah urutan Activity (lihat Bagian 3.5).

### 3.5 Tampilan Timeline

1. Activity dalam sebuah Routines WAJIB ditampilkan berurutan secara vertikal sebagai timeline.
2. Jam mulai WAJIB ditampilkan apabila Activity memilikinya.
3. Pada mode checklist, setiap Activity WAJIB dapat dicentang.
4. Pada mode non-checklist, Activity hanya ditampilkan tanpa kontrol centang.
5. Pengguna WAJIB dapat mengubah urutan Activity dengan drag-and-drop, dan urutan baru WAJIB tersimpan.

### 3.6 Card Progress

Card Progress WAJIB menampilkan jumlah Activity yang selesai dibandingkan total Activity pada Global Routines, dalam bentuk angka dan persentase.

### 3.7 Decision Block

Blok yang memuat beberapa Activity di dalamnya dalam satu waktu. Activity di dalam blok bersifat saling memilih: pengguna memilih salah satu. Blok dapat memiliki waktu, dapat juga tidak.

### 3.8 Condition Block

Blok yang bergantung pada suatu kondisi. Pada bagian atas blok, pengguna mengisi teks dengan format "Terjadi jika {kondisi}". Di dalam blok, pengguna memilih apa yang terjadi pada kondisi sebenarnya.

### 3.9 Push Notifikasi dan Reminder

Push notifikasi adalah pesan yang dikirim ke perangkat pengguna. Reminder adalah pengingat agar pengguna menjalankan suatu Activity pada waktunya.

### 3.10 Keterkaitan Pemicu antar Activity

Hubungan antar Activity dengan pola "setelah A, lanjut B" ala habit stacking, yaitu Activity berikutnya terkait dengan Activity sebelumnya. Berbeda dari urutan biasa pada timeline.

## 4. Model Data (Draf)

Draf ini bersifat usulan dan WAJIB ditinjau dan disesuaikan oleh developer sebelum dijalankan di Supabase.

### 4.1 Tabel `routines`

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid | Primary key. |
| user_id | uuid | Relasi ke `auth.users`. |
| name | text | Wajib. |
| kind | text | `global` atau `custom`. |
| mode | text | `checklist` atau `non_checklist`. |
| start_time | time | Opsional. |
| created_at | timestamptz | Bawaan `now()`. |

Batasan: setiap pengguna hanya boleh memiliki satu Routines dengan `kind = 'global'`.

### 4.2 Tabel `activities`

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid | Primary key. |
| routine_id | uuid | Relasi ke `routines`. |
| user_id | uuid | Relasi ke `auth.users`, untuk penyederhanaan kebijakan RLS. |
| name | text | Wajib. |
| start_time | time | Opsional. Wajib diisi pada Time Activity, divalidasi di form. |
| is_completed | boolean | Bawaan `false`. Hanya bermakna pada mode checklist. Diubah manual oleh pengguna, tanpa reset otomatis. |
| position | integer | Urutan dalam Routines. Diperbarui melalui drag-and-drop. |
| created_at | timestamptz | Bawaan `now()`. |

## 5. Aturan Akses

1. RLS WAJIB aktif pada seluruh tabel.
2. Pengguna hanya boleh membaca, menambah, mengubah, dan menghapus baris dengan `user_id = auth.uid()`.
3. Pengguna tanpa login tidak memiliki akses ke tabel mana pun.

## 6. Struktur Halaman

| Halaman | Isi |
|---|---|
| Login | Form login. |
| Register | Form registrasi. |
| Dasbor | Card Progress, timeline Global Routines, tombol Add Activity. |
| Daftar Routines | Seluruh Routines milik pengguna, termasuk pembuatan Custom Routines. |
| Detail Routines | Timeline dan pengelolaan Activity pada satu Routines. |

## 7. Batasan Teknis

1. Tech stack mengacu pada tabel di bagian atas dokumen ini. Perubahan stack WAJIB dicatat di sana.
2. Seluruh kode frontend WAJIB mengikuti `FRONTEND_CONVENTIONS.md`.
3. Pengerjaan dilakukan per fitur, dan fitur pada kelompok Lanjutan (Bagian 2.3) DILARANG dikerjakan sebelum ada keputusan.
4. Dependensi baru di luar Tech stack WAJIB disetujui developer sebelum dipasang.
5. Pengambilan data WAJIB melalui custom hook yang memanggil service.
6. Validasi formulir WAJIB memakai fitur bawaan React Hook Form, tanpa pustaka skema tambahan.
7. Umpan balik kepada pengguna (berhasil, galat) WAJIB memakai komponen daisyUI.
8. Antarmuka WAJIB responsif dengan pendekatan mobile-first.
9. Seluruh teks antarmuka WAJIB berbahasa Indonesia.

## 8. Catatan Keputusan

1. Card Progress menampilkan jumlah Activity selesai dibandingkan total pada Global Routines.
2. Status selesai tidak direset otomatis dan jam mulai hanya untuk tampilan. Perubahan status dilakukan manual oleh pengguna.
3. Riwayat penyelesaian per tanggal dan streak tidak termasuk cakupan MVP.
4. Urutan Activity diatur dengan drag-and-drop.
5. Global Routines dibuat otomatis saat registrasi dan awalnya kosong.
6. `FRONTEND_CONVENTIONS.md` bersifat universal untuk ekosistem React dan tidak menyebut pustaka spesifik. Pilihan pustaka hanya dicantumkan pada Tech stack di dokumen ini.
7. TanStack Query, Zod, react-hot-toast, dan Axios tidak dipakai pada MVP 1. Dapat dipertimbangkan kembali pada tahap berikutnya.
8. dnd-kit dipakai untuk drag-and-drop karena fitur tersebut termasuk MVP 1 dan drag-and-drop di layar sentuh tidak didukung dengan baik oleh fitur bawaan browser.
