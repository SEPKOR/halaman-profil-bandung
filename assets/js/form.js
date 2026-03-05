/**
 * form.js
 * Logika untuk Formulir Pendaftaran Warga - Pemerintah Kota Bandung
 * Fungsi: Pratinjau foto, validasi input, dan munculkan popup konfirmasi.
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. PRATINJAU FOTO (PHOTO PREVIEW) ---
  const inputFoto = document.getElementById("foto");
  const gambarPratinjau = document.getElementById("output-image");
  const teksPetunjuk = document.getElementById("foto-placeholder");

  if (inputFoto && gambarPratinjau) {
    inputFoto.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        // Buat alamat sementara untuk gambar dan tampilkan
        gambarPratinjau.src = URL.createObjectURL(file);
        gambarPratinjau.style.display = "block";
        if (teksPetunjuk) teksPetunjuk.style.display = "none";
      } else {
        // Sembunyikan jika tidak ada file
        gambarPratinjau.style.display = "none";
        if (teksPetunjuk) teksPetunjuk.style.display = "block";
      }
    });
  }

  // --- 2. MODAL KONFIRMASI (POPUP) ---
  const overlayModal = document.getElementById("modal-konfirmasi");
  const ringkasanData = document.getElementById("modal-ringkasan");
  const tombolBatal = document.getElementById("btn-batal");
  const tombolKonfirmasi = document.getElementById("btn-konfirmasi");
  const formulir = document.getElementById("form-pendaftaran");

  // Fungsi untuk menutup popup
  function tutupPopup() {
    overlayModal.classList.remove("active");
  }

  if (tombolBatal) {
    tombolBatal.addEventListener("click", tutupPopup);
  }

  if (tombolKonfirmasi) {
    tombolKonfirmasi.addEventListener("click", () => {
      tutupPopup();
      tampilkanPesanSukses();
      formulir.reset(); // Kosongkan form setelah sukses
      if (gambarPratinjau) gambarPratinjau.style.display = "none";
      if (teksPetunjuk) teksPetunjuk.style.display = "block";
    });
  }

  // --- 3. VALIDASI & KIRIM FORM ---
  if (formulir) {
    // Reset juga pratinjau foto jika tombol reset diklik
    formulir.addEventListener("reset", () => {
      if (gambarPratinjau) gambarPratinjau.style.display = "none";
      if (teksPetunjuk) teksPetunjuk.style.display = "block";
      // Bersihkan semua alert jika ada
    });

    formulir.addEventListener("submit", (e) => {
      e.preventDefault(); // Jangan kirim dulu, kita cek datanya

      // Ambil data penting
      const nik = document.getElementById("nik").value;
      const namaDepan = document.getElementById("nama-depan").value;
      const email = document.getElementById("email").value;

      // Validasi Sederhana: NIK harus 16 angka
      if (nik.length !== 16) {
        alert("Maaf, NIK harus terdiri dari 16 angka!");
        return;
      }

      // Jika valid, kumpulkan data untuk ditampilkan di popup
      const statusNikah =
        document.getElementById("status_pernikahan").value || "-";
      const jkTerpilih =
        document.querySelector('input[name="jenis_kelamin"]:checked')?.value ||
        "-";

      // Masukkan data ke dalam kotak popup
      ringkasanData.innerHTML = `
                <p><strong>NIK:</strong> ${nik}</p>
                <p><strong>Nama:</strong> ${namaDepan}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Status:</strong> ${statusNikah}</p>
                <p><strong>Jenis Kelamin:</strong> ${jkTerpilih}</p>
            `;

      // Munculkan popup
      overlayModal.classList.add("active");
    });
  }

  // --- 4. NOTIFIKASI SUKSES ---
  function tampilkanPesanSukses() {
    const notif = document.createElement("div");
    notif.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 1000;
            background: #0d2b52; color: white; padding: 15px 25px;
            border-radius: 5px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            font-family: sans-serif; font-weight: bold;
        `;
    notif.textContent = "✔ Data Berhasil Terkirim!";
    document.body.appendChild(notif);

    // Hilang sendiri setelah 3 detik
    setTimeout(() => notif.remove(), 3000);
  }
});
