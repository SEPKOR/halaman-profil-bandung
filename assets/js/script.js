/**
 * script.js
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. EFEK MUNCUL (FADE-IN) ---
  // Memberikan kelas 'fade-in' ke body saat halaman selesai dimuat agar muncul perlahan
  document.body.classList.add("fade-in");

  // --- 2. MENU HAMBURGER (Tampilan Mobile) ---
  const tombolMenu = document.querySelector(".nav-toggle"); // Tombol garis tiga
  const menuNavigasi = document.getElementById("mainNav"); // Daftar menu

  if (tombolMenu && menuNavigasi) {
    tombolMenu.addEventListener("click", () => {
      // Jika diklik, buka/tutup menu
      menuNavigasi.classList.toggle("nav-open");
      tombolMenu.classList.toggle("open");
    });
  }

  // --- 3. TOMBOL KEMBALI KE ATAS (BACK TO TOP) ---
  const tombolKeAtas = document.getElementById("backToTopBtn");

  if (tombolKeAtas) {
    // Munculkan tombol jika layar sudah di-scroll ke bawah lebih dari 20 pixel
    window.onscroll = function () {
      if (
        document.documentElement.scrollTop > 20 ||
        document.body.scrollTop > 20
      ) {
        tombolKeAtas.style.display = "block";
      } else {
        tombolKeAtas.style.display = "none";
      }
    };

    // Jika tombol diklik, geser layar ke paling atas
    tombolKeAtas.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Efek geser halus
      });
    });
  }

  // --- 4. EFEK PERPINDAHAN HALAMAN (TRANSITION) ---
  // Memberikan animasi saat pindah halaman agar terlihat profesional
  const semuaLink = document.querySelectorAll("a");

  semuaLink.forEach((link) => {
    link.addEventListener("click", function (e) {
      const alamatTujuan = this.getAttribute("href");

      // Abaikan jika itu link internal atau link kosong
      if (
        !alamatTujuan ||
        alamatTujuan.startsWith("#") ||
        alamatTujuan.startsWith("mailto:")
      ) {
        return;
      }

      // Pastikan link menuju halaman di dalam website ini saja
      if (this.hostname === window.location.hostname || !this.hostname) {
        e.preventDefault(); // Stop pindah halaman seketika

        // Mulai animasi menghilang (fade-out)
        document.body.classList.remove("fade-in");
        document.body.classList.add("fade-out");

        // Tunggu 0.5 detik (durasi animasi) baru pindah halaman
        setTimeout(() => {
          window.location.href = alamatTujuan;
        }, 500);
      }
    });
  });
});
