# Frontend Conventions

| | |
|---|---|
| Versi | 1.1 |
| Diperbarui | 21 November 2026 |
| Cakupan | Seluruh kode frontend berbasis ekosistem React |

## 1. Tujuan

Dokumen ini menetapkan standar penulisan dan pengorganisasian kode frontend agar mudah dibaca, dirawat, dan konsisten antar fitur. Standar berlaku bagi seluruh kontributor, termasuk asisten AI yang digunakan dalam proses pengembangan.

Dokumen ini khusus untuk ekosistem React dan hanya memuat aturan universal yang tidak bergantung pada pustaka tertentu. Pilihan pustaka dan teknologi dicantumkan pada Tech stack di `SPEC.md`, dan dapat berubah tanpa mengubah dokumen ini.

## 2. Kata Kunci

- **WAJIB**: ketentuan yang harus dipenuhi tanpa pengecualian.
- **DILARANG**: tindakan yang tidak boleh dilakukan.
- **DISARANKAN**: praktik yang dianjurkan; penyimpangan harus punya alasan yang jelas.

## 3. Struktur Direktori

### 3.1 Susunan Dasar

```
src/
  common/              Elemen yang dipakai lintas fitur
    components/
    hooks/
    utils/
    types/
  features/
    <nama-fitur>/
      components/
      hooks/
      services/
      types/
      index.ts         Titik masuk tunggal fitur
  lib/                 Inisialisasi klien layanan backend dan konfigurasi pustaka
  constants/           Konstanta dan teks tetap
```

### 3.2 Penempatan Kode

1. Elemen yang hanya dipakai oleh satu fitur WAJIB ditempatkan di dalam direktori fitur tersebut.
2. Elemen yang dipakai oleh dua fitur atau lebih, atau bersifat global, WAJIB dipindahkan ke `common`.
3. Ketentuan ini berlaku untuk komponen, hook, utilitas, dan tipe.

### 3.3 Aturan Dependensi Antar Modul

1. `common` DILARANG mengimpor dari `features`.
2. Sebuah fitur DILARANG mengimpor dari fitur lain.
3. Impor dari luar fitur WAJIB melalui `index.ts` milik fitur tersebut.

### 3.4 Pembuatan Subdirektori

1. Subdirektori (`components/`, `hooks/`, dan sejenisnya) WAJIB dibuat hanya ketika terdapat minimal tiga berkas sejenis.
2. Direktori kosong dan direktori yang hanya berisi satu berkas DILARANG.
3. Fitur dengan satu atau dua komponen menempatkan berkasnya langsung di direktori fitur.
4. Dalam satu fitur, pola penyusunan WAJIB konsisten. Apabila fitur telah menggunakan `components/`, seluruh komponennya ditempatkan di sana.

Contoh fitur berskala kecil:

```
features/profile/
  ProfileCard.tsx
  index.ts
```

Contoh fitur setelah berkembang:

```
features/profile/
  components/
    ProfileCard.tsx
    ProfileForm.tsx
    ProfileAvatar.tsx
  hooks/
    useProfile.ts
  services/
    profileService.ts
  types/
    profile.types.ts
  index.ts
```

## 4. Pemisahan Tanggung Jawab

| Lapisan | Tanggung jawab | Lokasi |
|---|---|---|
| Komponen | Presentasi antarmuka | `components/` |
| Hook | Logika, state, dan orkestrasi data | `hooks/` |
| Service | Akses data (backend atau layanan eksternal) | `services/` |
| Tipe | Definisi tipe dan interface | `types/` |

1. Komponen DILARANG memanggil klien backend atau layanan eksternal secara langsung.
2. Seluruh akses data WAJIB melalui `services/` dan dipanggil dari hook.
3. Klien layanan backend WAJIB diinisialisasi pada satu berkas di `lib/` dan digunakan bersama oleh semua service.

## 5. Komponen

1. Setiap komponen WAJIB memiliki satu tanggung jawab.
2. Ukuran komponen DISARANKAN tidak melebihi sekitar 150 baris. Komponen yang melampaui batas ini WAJIB dipecah menjadi komponen atau hook yang lebih kecil.
3. Apabila logika dalam komponen menjadi kompleks (banyak `useState` atau `useEffect`, percabangan berlapis), logika tersebut WAJIB diekstrak ke custom hook.
   - Hook yang dipakai satu fitur ditempatkan di `features/<nama-fitur>/hooks/`.
   - Hook yang dipakai lintas fitur ditempatkan di `common/hooks/`.
4. Pemisahan komponen container (logika) dan komponen presentasional (tampilan) DISARANKAN bila ukuran atau kompleksitas komponen menuntutnya.
5. Seluruh props WAJIB memiliki tipe. Komponen WAJIB berupa function component.

## 6. Tipe dan Interface

1. Tipe dan interface (misalnya `User`, `Task`) WAJIB dipisahkan ke direktori `types/`, bukan ditulis di dalam berkas komponen.
2. Tipe milik satu fitur ditempatkan di `features/<nama-fitur>/types/`. Tipe global ditempatkan di `common/types/`.
3. Tipe yang bersumber dari skema backend (misalnya skema basis data) WAJIB dihasilkan otomatis melalui tooling bawaan backend. Penulisan ulang secara manual DILARANG.
4. Tipe longgar (misalnya `any` pada TypeScript) DILARANG. Gunakan tipe yang tidak diketahui (misalnya `unknown`) dan lakukan penyempitan tipe bila diperlukan.
5. Proyek WAJIB memakai pengetikan statis dengan mode paling ketat yang tersedia pada tooling proyek.

## 7. Konvensi Penamaan

| Jenis | Format | Contoh |
|---|---|---|
| Komponen | PascalCase | `TaskList.tsx` |
| Hook | `useXxx` | `useTasks.ts` |
| Fungsi dan variabel | camelCase | `formatDate` |
| Konstanta | UPPER_SNAKE_CASE | `MAX_TITLE_LENGTH` |
| Tipe dan interface | PascalCase | `Task`, `UserProfile` |
| Service | `xxxService.ts` | `taskService.ts` |
| Berkas tipe | `xxx.types.ts` | `task.types.ts` |

Nama berkas WAJIB mencerminkan isinya, dengan satu komponen utama per berkas.

## 8. Konstanta

1. Nilai literal (angka, string, rute) DILARANG ditulis langsung di dalam logika.
2. Konstanta dan teks tetap WAJIB ditempatkan di `constants/`, atau di direktori fitur apabila hanya dipakai oleh fitur tersebut.

## 9. Data dan State

1. Pengambilan dan pengelolaan data server WAJIB menggunakan satu pendekatan atau pustaka yang seragam di seluruh proyek, sesuai Tech stack pada `SPEC.md`. Pengambilan data manual yang tersebar di dalam komponen (misalnya `useEffect` dengan `fetch`) DILARANG.
2. Validasi formulir dan input WAJIB menggunakan satu pendekatan atau pustaka yang seragam di seluruh proyek. Tipe DISARANKAN diturunkan dari skema validasi agar tidak ditulis ganda.
3. Setiap tampilan yang menampilkan data WAJIB menangani tiga kondisi: memuat (loading), galat (error), dan data kosong.
4. State lokal DISARANKAN ditempatkan sedekat mungkin dengan komponen yang menggunakannya. State global hanya dipakai bila ada kebutuhan yang jelas.

## 10. Keamanan dan Konfigurasi

1. Kredensial dan konfigurasi WAJIB dikelola melalui berkas `.env`. Penulisan URL, key, atau token langsung di kode DILARANG.
2. Kunci dengan hak akses penuh (misalnya service role key atau secret key) DILARANG digunakan di frontend. Frontend hanya menggunakan kunci publik.
3. Penggunaan kunci publik hanya dapat diterima apabila kontrol akses di sisi backend (misalnya Row Level Security) aktif pada seluruh sumber data. Frontend tidak boleh diasumsikan sebagai lapisan pengaman akses data.
4. Data sensitif (token, data pribadi) DILARANG dicatat ke console.

## 11. Ketentuan bagi Asisten AI

1. Sebelum menulis kode, asisten WAJIB menyampaikan rencana berupa daftar berkas yang akan dibuat atau diubah beserta lokasinya, dan menunggu persetujuan.
2. Setiap permintaan mencakup satu fitur. Asisten DILARANG mengerjakan fitur di luar yang diminta.
3. Asisten DILARANG mengubah berkas di luar cakupan fitur yang diminta.
4. Asisten DILARANG menambahkan dependensi baru tanpa persetujuan tertulis.
5. Apabila permintaan bertentangan dengan dokumen ini, asisten WAJIB meminta klarifikasi dan tidak mengambil keputusan sendiri.
6. Penulisan komentar kode WAJIB mengikuti ketentuan pada Bagian 12.

## 12. Komentar Kode

### 12.1 Prinsip

Asisten AI DILARANG menulis komentar, kecuali pada salah satu dari dua kondisi pada Bagian 12.2 dan 12.3.

### 12.2 Tindakan di Luar Kendali Asisten

Komentar WAJIB ditulis apabila suatu nilai atau langkah hanya dapat dipenuhi oleh developer, misalnya:

- API key, token, atau kredensial lain.
- URL layanan backend dan nilai konfigurasi lingkungan.
- Pengaturan pada layanan eksternal (dashboard backend, penyedia deploy).

Komentar WAJIB menyebutkan apa yang harus dilakukan dan di mana. Komentar jenis ini WAJIB diawali penanda `TODO(developer):` agar mudah dicari.

```ts
// TODO(developer): Isi API_URL pada berkas .env dengan URL layanan backend.
```

### 12.3 Informasi Penting

Komentar WAJIB ditulis apabila tanpa komentar tersebut developer berpotensi salah memahami perilaku kode, misalnya:

- Keputusan implementasi yang tidak lazim.
- Ketergantungan yang tidak terlihat dari kode, seperti kebijakan akses di backend atau urutan pemanggilan.
- Efek samping atau batasan yang tidak jelas dari nama fungsi.

```ts
// Penghapusan bersifat soft delete: baris tetap ada dengan deleted_at terisi, sehingga query lain wajib memfilternya.
```

### 12.4 Larangan

Komentar DILARANG digunakan untuk:

- Mengulang atau menjelaskan hal yang sudah jelas dari kode.
- Menjelaskan nama fungsi, variabel, atau tipe.
- Pemisah atau hiasan antar bagian kode.
- Menyimpan kode yang dinonaktifkan.

### 12.5 Format

1. Komentar WAJIB singkat, maksimal dua kalimat.
2. Komentar WAJIB menjelaskan alasan atau tindakan yang diperlukan, bukan cara kerja tiap baris.
3. Apabila ragu apakah suatu komentar memenuhi 12.2 atau 12.3, komentar tersebut tidak ditulis.

## 13. Kriteria Penerimaan

Sebuah fitur dinyatakan selesai apabila memenuhi seluruh butir berikut:

- Struktur direktori sesuai Bagian 3, tanpa direktori kosong atau direktori berisi satu berkas.
- Aturan dependensi antar modul terpenuhi.
- Tidak ada komponen yang memanggil backend atau layanan eksternal secara langsung.
- Tidak ada tipe longgar, dan seluruh props bertipe.
- Kondisi loading, error, dan data kosong telah ditangani.
- Tidak ada kredensial atau nilai literal yang tertanam di kode.
- Tidak ada dependensi baru yang belum disetujui.
- Tidak ada perubahan pada berkas di luar cakupan fitur.
- Tidak ada komponen yang melampaui batas ukuran pada Bagian 5.
- Seluruh komentar memenuhi Bagian 12, dan setiap tindakan developer ditandai `TODO(developer):`.
