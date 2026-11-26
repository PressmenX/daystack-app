# Daystack: Spesifikasi

- **Versi Document**: 0.15 (*draf*)
- **Versi App** : 1.3.3
- **Updated** : 26 November 2026
- **Platform** : Web responsif dengan pendekatan mobile-first.
- **Bahasa Antarmuka** : Indonesia
- **Tech Stack**
    1. **Frontend** : Vite, React, TypeScript, Tailwind CSS, daisyUI, React Hook Form, React Router, dnd-kit
    2. **Backend :** Supabase
    3. **Deployment** : Vercel

---

## 1. Overview

Daystack adalah aplikasi untuk menyusun rutinitas harian dalam bentuk urutan aktivitas, terinspirasi dari konsep habit stacking. Pengguna menyusun aktivitas secara berurutan dalam sebuah rutinitas dan melihatnya sebagai timeline. Pada mode checklist, pengguna menandai aktivitas yang telah selesai.

Daystack memiliki satu peran, yaitu pengguna terdaftar. Setiap pengguna hanya dapat mengakses data miliknya sendiri.

### Pages

- **Login & Register:** Halaman publik untuk login dan register.
- **Dasbor :** Halaman yang menampilkan Card Progress, timeline Global Routines, dan tombol Add Activity.

---

## 2. Glossary

- **Routines :** Kelompok Activity yang tersusun berurutan, seperti folder.
- **Global Routines :** Routines bawaan yang tampil di Dasbor. Global Routines selalu berada pada mode checklist.
- **Custom Routines :** Routines buatan pengguna, misalnya Morning Routines, Night Routines, dan Weekend Routines.
- **Mode checklist :** Mode Routines yang memungkinkan pengguna mencentang Activity sebagai selesai.
- **Mode non-checklist :** Mode Routines yang menampilkan Activity sebagai timeline tanpa centang. Mode ini adalah mode bawaan untuk Routines selain Global Routines.
- **Activity :** Blok aktivitas dalam sebuah Routines.
- **Default Activity :** Jenis Activity yang hanya mewajibkan Nama.
- **Time Activity :** Jenis Activity yang mewajibkan Jam mulai.

---

## 3. Feature

### MVP (  *Minimum Viable Product* )

- F-01 Login dan register akun
- F-02 Global Routines
- F-03 Tampilan timeline
- F-04 Card Progress
- F-05 Tambah, ubah, dan hapus Activity
- F-06 Pengaturan urutan Activity
- F-12 Pengelolaan banyak Activity sekaligus

### Post-MVP

- F-07 Custom Routines
- F-08 Pilihan jenis Activity saat menambah

### Backlog

- F-09 Decision Block
- F-10 Condition Block
- F-11 Push notifikasi dan reminder

---

## 4. Feature Details

#### F-01 Login dan register akun

- Pengguna dapat melakukan register dan login dengan email dan password melalui Supabase Auth.
- Daystack harus mengizinkan akses ke Dasbor hanya setelah pengguna login.
- Daystack harus mengarahkan pengguna yang belum login ke halaman Login.

#### F-02 Global Routines

- Daystack harus menyediakan satu Global Routines untuk setiap pengguna.
- Global Routines harus berada pada mode checklist.
- Daystack harus membuat Global Routines secara otomatis saat session pengguna tersedia setelah register atau login.
- Daftar Activity pada Global Routines harus kosong saat pertama kali dibuat.
- Daystack harus menampilkan Global Routines di Dasbor dalam bentuk timeline.

#### F-03 Tampilan timeline

- Daystack harus menampilkan Activity dalam sebuah Routines secara berurutan ke bawah sebagai timeline.
- Daystack harus menampilkan Jam mulai pada Activity yang memilikinya.
- Pada mode checklist, pengguna dapat mencentang setiap Activity.
- Pada mode non-checklist, Daystack tidak menampilkan kontrol centang.
- Daystack hanya mengubah status selesai ketika pengguna mencentang atau membatalkan centang.
- Daystack tidak boleh mereset status selesai secara otomatis, termasuk saat pergantian hari.
- Jam mulai tidak boleh memengaruhi status selesai.

#### F-04 Card Progress

- Daystack harus menampilkan jumlah Activity selesai dibandingkan dengan total Activity pada Global Routines, dalam bentuk angka dan persentase.
- Daystack harus memperbarui Card Progress setiap kali status selesai sebuah Activity berubah.
- Contoh: Global Routines berisi 4 Activity dan 1 Activity selesai. Card Progress menampilkan "1 dari 4" dan "25%".

#### F-05 Tambah, ubah, dan hapus Activity

- Pengguna dapat menambah Activity.
- Pengguna dapat mengubah Activity.
- Pengguna dapat menghapus Activity.
- Form Add harus memuat semua field Activity.
- Pada Default Activity, hanya Nama yang wajib diisi. Field lain dapat dikosongkan.
- Form harus menolak pengiriman bila Nama kosong.
- Nama Activity dibatasi maksimal 120 karakter.
- Field Activity terdiri dari:
    - Nama, wajib diisi.
    - Jam mulai, opsional dan hanya berfungsi sebagai tampilan.
    - isCompleted, opsional dan hanya berlaku pada mode checklist.

#### F-06 Pengaturan urutan Activity

- Pengguna dapat mengubah urutan Activity dengan drag-and-drop.
- Daystack harus menyimpan urutan baru sehingga urutan tersebut tetap sama setelah halaman dimuat ulang.
- Drag-and-drop harus berfungsi di layar sentuh.
- Contoh: Urutan awal adalah A, B, C. Pengguna memindahkan C ke posisi pertama. Urutan menjadi C, A, B.

#### F-07 Custom Routines

- Pengguna dapat membuat Custom Routines.
- Field Custom Routines terdiri dari:
    - Nama, wajib diisi.
    - Waktu terjadi, opsional.
    - Jenis, wajib dipilih antara checklist dan non-checklist.
- Custom Routines harus berjalan pada mode sesuai jenis yang dipilih.
- Fitur ini bergantung pada F-02, F-03, dan F-05.

#### F-08 Pilihan jenis Activity saat menambah

- Tombol Add harus menampilkan pilihan jenis Activity, yaitu Default Activity dan Time Activity.
- Pada Time Activity, Jam mulai wajib diisi.
- Form harus memvalidasi Jam mulai pada Time Activity.
- Fitur ini bergantung pada F-05.

#### F-12 Pengelolaan banyak Activity sekaligus

- Pengguna dapat memilih beberapa Activity dalam mode edit.
- Pengguna dapat menyelesaikan semua Activity yang dipilih sekaligus.
- Pengguna dapat menghapus beberapa Activity yang dipilih sekaligus.
- Pengguna dapat menghapus semua Activity melalui tombol Clear All.
- Nama Activity harus memiliki panjang maksimal 120 karakter.

---

## 5. Data

*Catatan : Model data ini berstatus draf. Developer harus meninjau dan menyesuaikannya sebelum dijalankan di Supabase.*

### Tabel `routines`

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| id | uuid | Primary key. |
| user_id | uuid | Relasi ke `auth.users`. |
| name | text | Wajib diisi. |
| kind | text | Saat ini hanya `global`. |
| mode | text | Saat ini hanya `checklist`. |
| start_time | time | Opsional. |
| created_at | timestamptz | Default `now()`. |

#### Rule

- Setiap pengguna hanya boleh memiliki satu Routines dengan `kind = 'global'`.

### Tabel `activities`

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| id | uuid | Primary key. |
| routine_id | uuid | Relasi ke `routines`. |
| user_id | uuid | Relasi ke `auth.users`, untuk menyederhanakan kebijakan RLS. |
| name | text | Wajib diisi. |
| start_time | time | Opsional. Wajib diisi pada Time Activity dan divalidasi di form. |
| is_completed | boolean | Default `false`. Hanya bermakna pada mode checklist. Diubah secara manual oleh pengguna. |
| position | integer | Urutan dalam Routines. Diperbarui melalui drag-and-drop. |
| created_at | timestamptz | Default `now()`. |

### Access Policy

- RLS harus aktif pada semua tabel.
- Pengguna hanya boleh membaca, menambah, mengubah, dan menghapus baris dengan `user_id = auth.uid()`.
- Pengguna yang belum login tidak boleh mengakses tabel mana pun.