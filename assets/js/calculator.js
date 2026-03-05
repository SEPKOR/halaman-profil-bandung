/**
 * calculator.js
 * Logika Kalkulator Sederhana - Pemerintah Kota Bandung
 * Dibuat sederhana agar mudah dipelajari oleh siswa SMK.
 */

// --- VARIABEL UTAMA ---
let angkaSekarang = "0"; // Angka yang tampil di layar
let angkaPertama = null; // Angka pertama sebelum pilih operator
let operatorDipilih = null; // Simbol (+, -, *, /)
let statusOperatorBaru = false; // Penanda jika baru saja klik operator

// Ambil elemen layar dari HTML
const layarUtama = document.getElementById("layar");
const layarEkspresi = document.getElementById("ekspresi");

/**
 * FUNGSI: Mengupdate angka yang muncul di layar kalkulator
 */
function updateLayar() {
  layarUtama.textContent = angkaSekarang;
}

/**
 * FUNGSI: Input Angka (0-9)
 */
function inputAngka(angka) {
  // Jika baru klik operator atau layar masih 0, ganti angkanya
  if (statusOperatorBaru || angkaSekarang === "0") {
    angkaSekarang = angka;
    statusOperatorBaru = false;
  } else {
    // Batasi maksimal 12 digit agar tidak meluber
    if (angkaSekarang.length < 12) {
      angkaSekarang += angka;
    }
  }
  updateLayar();
}

/**
 * FUNGSI: Memasukkan Titik Desimal (.)
 */
function inputTitik() {
  if (statusOperatorBaru) {
    angkaSekarang = "0.";
    statusOperatorBaru = false;
  } else if (!angkaSekarang.includes(".")) {
    angkaSekarang += ".";
  }
  updateLayar();
}

/**
 * FUNGSI: Memasukkan Operator (+, -, *, /)
 */
function inputOperator(op) {
  // Jika sudah ada angka pertama, lakukan hitungan sementara
  if (angkaPertama !== null && !statusOperatorBaru) {
    hitungOtomatis();
  }

  angkaPertama = parseFloat(angkaSekarang);
  operatorDipilih = op;
  statusOperatorBaru = true;

  // Tampilkan riwayat di baris kecil
  layarEkspresi.textContent = angkaPertama + " " + op;
}

/**
 * FUNGSI: Mengubah angka menjadi Persen (/100)
 */
function inputPersen() {
  let nilai = parseFloat(angkaSekarang);
  angkaSekarang = String(nilai / 100);
  updateLayar();
}

/**
 * FUNGSI: Melakukan Perhitungan (Sama Dengan / =)
 */
function hitung() {
  // Jika tidak ada operasi, jangan lakukan apa-apa
  if (angkaPertama === null || operatorDipilih === null) return;

  let b = parseFloat(angkaSekarang);
  let hasil = 0;

  // Proses Matematika
  if (operatorDipilih === "+") {
    hasil = angkaPertama + b;
  } else if (operatorDipilih === "−") {
    hasil = angkaPertama - b;
  } else if (operatorDipilih === "×") {
    hasil = angkaPertama * b;
  } else if (operatorDipilih === "÷") {
    if (b === 0) {
      alert("Error: Tidak bisa dibagi 0!");
      resetAll();
      return;
    }
    hasil = angkaPertama / b;
  }

  // Tampilkan Riwayat Lengkap
  layarEkspresi.textContent =
    angkaPertama + " " + operatorDipilih + " " + b + " =";

  // Simpan hasil ke layar
  angkaSekarang = String(parseFloat(hasil.toFixed(10)));
  updateLayar();

  // Reset data operasi setelah selesai hitung
  angkaPertama = null;
  operatorDipilih = null;
  statusOperatorBaru = true;
}

/**
 * FUNGSI: Hitung Otomatis (Saat pilih operator berulang kali)
 */
function hitungOtomatis() {
  let b = parseFloat(angkaSekarang);
  let hasil = 0;

  if (operatorDipilih === "+") hasil = angkaPertama + b;
  else if (operatorDipilih === "−") hasil = angkaPertama - b;
  else if (operatorDipilih === "×") hasil = angkaPertama * b;
  else if (operatorDipilih === "÷") hasil = angkaPertama / b;

  angkaSekarang = String(parseFloat(hasil.toFixed(10)));
  updateLayar();
}

/**
 * FUNGSI: Hapus satu angka terakhir (Backspace)
 */
function hapusSatu() {
  if (statusOperatorBaru) return;

  if (angkaSekarang.length <= 1) {
    angkaSekarang = "0";
  } else {
    angkaSekarang = angkaSekarang.slice(0, -1);
  }
  updateLayar();
}

/**
 * FUNGSI: Reset Semua (Tombol AC)
 */
function resetAll() {
  angkaSekarang = "0";
  angkaPertama = null;
  operatorDipilih = null;
  statusOperatorBaru = false;
  layarEkspresi.textContent = "";
  updateLayar();
}

// --- DUKUNGAN KEYBOARD ---
document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") inputAngka(e.key);
  else if (e.key === ".") inputTitik();
  else if (e.key === "+") inputOperator("+");
  else if (e.key === "-") inputOperator("−");
  else if (e.key === "*") inputOperator("×");
  else if (e.key === "/") {
    e.preventDefault();
    inputOperator("÷");
  } else if (e.key === "Enter" || e.key === "=") hitung();
  else if (e.key === "Backspace") hapusSatu();
  else if (e.key === "Escape") resetAll();
});
