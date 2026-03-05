// ============================================================
// form.js — Logika Formulir Pendaftaran Identitas Warga
// • Pratinjau foto
// • Validasi field wajib (NIK, email, telepon)
// • Popup konfirmasi data sebelum submit
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // ────────────────────────────────────────────────────────
  // PRATINJAU FOTO
  // Menampilkan gambar yang dipilih user di dalam .photo-box
  // ────────────────────────────────────────────────────────
  const photoInput = document.getElementById("foto");
  const outputImage = document.getElementById("output-image");
  const fotoPlaceholder = document.getElementById("foto-placeholder");

  if (photoInput && outputImage) {
    photoInput.addEventListener("change", (event) => {
      const [file] = event.target.files;
      if (file) {
        // Tampilkan pratinjau gambar yang dipilih
        outputImage.src = URL.createObjectURL(file);
        outputImage.style.display = "block";
        if (fotoPlaceholder) fotoPlaceholder.style.display = "none";
      } else {
        // Sembunyikan gambar jika tidak ada file dipilih
        outputImage.src = "";
        outputImage.style.display = "none";
        if (fotoPlaceholder) fotoPlaceholder.style.display = "block";
      }
    });
  }

  // ────────────────────────────────────────────────────────
  // POPUP KONFIRMASI — Elemen-elemen modal
  // ────────────────────────────────────────────────────────
  const modalOverlay = document.getElementById("modal-konfirmasi");
  const modalRingkasan = document.getElementById("modal-ringkasan");
  const btnBatal = document.getElementById("btn-batal");
  const btnKonfirmasi = document.getElementById("btn-konfirmasi");
  const form = document.getElementById("form-pendaftaran");

  // Fungsi: Menutup modal tanpa submit (user bisa koreksi data)
  function tutupModal() {
    modalOverlay.classList.remove("active");
  }

  // Tombol "Batal / Koreksi" → tutup popup
  if (btnBatal) {
    btnBatal.addEventListener("click", tutupModal);
  }

  // Klik area gelap di luar kotak popup → tutup popup
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) tutupModal();
    });
  }

  // Tombol "Ya, Kirim Data" → proses form (tampilkan pesan sukses)
  if (btnKonfirmasi) {
    btnKonfirmasi.addEventListener("click", () => {
      tutupModal();
      // Di sini Anda bisa ganti dengan form.submit() atau fetch API
      tampilkanSukses();
    });
  }

  // ────────────────────────────────────────────────────────
  // VALIDASI FORM & TAMPILKAN POPUP KONFIRMASI
  // ────────────────────────────────────────────────────────
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault(); // Selalu cegah submit langsung

      // Bersihkan semua error sebelumnya
      document.querySelectorAll(".error-message").forEach((el) => el.remove());
      document
        .querySelectorAll(".invalid-field")
        .forEach((el) => el.classList.remove("invalid-field"));

      let isValid = true;

      // Validasi semua field yang wajib (required)
      form.querySelectorAll("[required]").forEach((input) => {
        if (!input.value.trim()) {
          isValid = false;
          tampilkanError(input, "Field ini wajib diisi.");
          input.classList.add("invalid-field");
        }
      });

      // Validasi NIK: harus tepat 16 digit
      const nikInput = document.getElementById("nik");
      if (nikInput && nikInput.value.length !== 16) {
        isValid = false;
        tampilkanError(nikInput, "NIK harus tepat 16 digit.");
        nikInput.classList.add("invalid-field");
      }

      // Validasi format email (jika diisi)
      const emailInput = document.getElementById("email");
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (
        emailInput &&
        emailInput.value.trim() &&
        !emailPattern.test(emailInput.value.trim())
      ) {
        isValid = false;
        tampilkanError(emailInput, "Format email tidak valid.");
        emailInput.classList.add("invalid-field");
      }

      // Validasi nomor telepon: hanya angka (jika diisi)
      const teleponInput = document.getElementById("telepon");
      const phonePattern = /^[0-9]+$/;
      if (
        teleponInput &&
        teleponInput.value.trim() &&
        !phonePattern.test(teleponInput.value.trim())
      ) {
        isValid = false;
        tampilkanError(teleponInput, "Nomor telepon hanya boleh berisi angka.");
        teleponInput.classList.add("invalid-field");
      }

      // Jika ada error → hentikan, tidak tampilkan popup
      if (!isValid) {
        const firstError = document.querySelector(".invalid-field");
        if (firstError)
          firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      // Jika semua valid → kumpulkan data dan tampilkan popup
      bukaPopupKonfirmasi();
    });
  }

  // ────────────────────────────────────────────────────────
  // FUNGSI: Kumpulkan data dari form dan tampilkan di popup
  // ────────────────────────────────────────────────────────
  function bukaPopupKonfirmasi() {
    // Ambil nilai setiap field
    const nik = document.getElementById("nik")?.value.trim() || "-";
    const namaDepan =
      document.getElementById("nama-depan")?.value.trim() || "-";
    const namaBelakang =
      document.getElementById("nama-belakang")?.value.trim() || "";
    const namaLengkap = (namaDepan + " " + namaBelakang).trim();
    const email = document.getElementById("email")?.value.trim() || "-";
    const telepon = document.getElementById("telepon")?.value.trim() || "-";
    const alamat = document.getElementById("alamat")?.value.trim() || "-";
    const tempatLahir =
      document.getElementById("tempat-lahir")?.value.trim() || "-";
    const tglLahir = document.getElementById("tgl_lahir")?.value || "-";
    const agama = document.getElementById("agama")?.value || "-";
    const statusNikah =
      document.getElementById("status_pernikahan")?.value || "-";

    // Jenis kelamin dari radio button yang dipilih
    const jkRadio = document.querySelector(
      'input[name="jenis_kelamin"]:checked',
    );
    const jenisKelamin = jkRadio ? jkRadio.value : "-";

    // Bahasa asing dari checkbox yang dipilih (bisa lebih dari satu)
    const bahasaChecked = Array.from(
      document.querySelectorAll('input[name="bahasa_asing"]:checked'),
    ).map((cb) => cb.value);
    const bahasaAsing =
      bahasaChecked.length > 0 ? bahasaChecked.join(", ") : "Tidak ada";

    // Bangun HTML ringkasan data untuk ditampilkan di modal
    modalRingkasan.innerHTML = `
            <div><strong>NIK</strong>: ${nik}</div>
            <div><strong>Nama Lengkap</strong>: ${namaLengkap}</div>
            <div><strong>Email</strong>: ${email}</div>
            <div><strong>Telepon</strong>: ${telepon}</div>
            <div><strong>Alamat</strong>: ${alamat}</div>
            <div><strong>Tempat/Tgl Lahir</strong>: ${tempatLahir}, ${tglLahir}</div>
            <div><strong>Agama</strong>: ${agama}</div>
            <div><strong>Status Pernikahan</strong>: ${statusNikah}</div>
            <div><strong>Jenis Kelamin</strong>: ${jenisKelamin}</div>
            <div><strong>Bahasa Asing</strong>: ${bahasaAsing}</div>
        `;

    // Tampilkan overlay modal
    modalOverlay.classList.add("active");
  }

  // ────────────────────────────────────────────────────────
  // FUNGSI: Tampilkan pesan error di bawah field input
  // ────────────────────────────────────────────────────────
  function tampilkanError(inputElement, pesan) {
    const errorEl = document.createElement("div");
    errorEl.classList.add("error-message");
    errorEl.textContent = pesan;
    inputElement.parentNode.insertBefore(errorEl, inputElement.nextSibling);
  }

  // ────────────────────────────────────────────────────────
  // FUNGSI: Notifikasi sukses setelah data dikonfirmasi
  // (Ganti bagian ini dengan AJAX / fetch() ke server nyata)
  // ────────────────────────────────────────────────────────
  function tampilkanSukses() {
    // Reset form setelah berhasil dikirim
    form.reset();
    if (outputImage) {
      outputImage.src = "";
      outputImage.style.display = "none";
    }
    if (fotoPlaceholder) fotoPlaceholder.style.display = "block";

    // Tampilkan notifikasi sukses sederhana
    const notif = document.createElement("div");
    notif.style.cssText = `
            position:fixed; top:24px; right:24px; z-index:99999;
            background:#0d2b52; color:#fff; padding:16px 26px;
            border-radius:4px; font-family:'Source Sans 3',sans-serif;
            font-size:0.95rem; font-weight:600; box-shadow:0 4px 18px rgba(13,43,82,0.35);
            border-left:4px solid #3b82c4;
            animation: slideIn 0.3s ease;
        `;
    notif.textContent = "✔ Data berhasil dikirim. Terima kasih!";
    document.body.appendChild(notif);

    // Hapus notifikasi setelah 4 detik
    setTimeout(() => notif.remove(), 4000);
  }
}); // END DOMContentLoaded
