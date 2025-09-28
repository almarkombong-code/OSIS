#!/bin/bash

# ==============================================================================
# SKRIP UNTUK MENGUNGGAH PROYEK KE GITHUB DARI KOMPUTER LOKAL
# ==============================================================================
#
# CARA PENGGUNAAN:
# 1. Buka file ini.
# 2. Ganti tulisan "https://github.com/NAMA_PENGGUNA_ANDA/NAMA_REPOSITORI_ANDA.git" 
#    dengan URL repositori GitHub Anda sendiri.
# 3. Simpan file ini.
# 4. Buka terminal di folder proyek ini dan jalankan perintah: bash push-ke-github.sh
#
# ==============================================================================

# <<< GANTI URL DI BAWAH INI DENGAN URL REPOSITORI GITHUB ANDA >>>
GITHUB_URL="https://github.com/almarkombong-code/OSIS.git"

# Hapus folder .git yang lama untuk memulai dari awal yang bersih
echo "Menghapus direktori .git yang lama..."
rm -rf .git

# Inisialisasi repositori Git baru
echo "Inisialisasi repositori Git baru..."
git init

# Tambahkan semua file ke staging area
echo "Menambahkan semua file..."
git add .

# Buat commit pertama
echo "Membuat commit awal..."
git commit -m "Initial commit: Mengunggah seluruh file proyek"

# Ubah nama branch utama menjadi 'main'
echo "Mengganti nama branch menjadi 'main'..."
git branch -M main

# Tambahkan remote origin ke repositori GitHub Anda
echo "Menambahkan remote origin ke ${GITHUB_URL}..."
git remote add origin ${GITHUB_URL}

# Lakukan force push untuk mengunggah semuanya
echo "Mengunggah proyek ke GitHub (force push)..."
git push -u -f origin main

echo "=============================================================================="
echo "SELESAI! Proyek Anda seharusnya sudah berhasil diunggah ke GitHub."
echo "Silakan periksa halaman repositori Anda."
echo "=============================================================================="
