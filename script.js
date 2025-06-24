// Data mobil
const mobilList = [
  { nama: "Toyota Avanza", harga: 500000, gambar: "assets/img/avanza.jpg" },
  { nama: "Toyota Innova", harga: 700000, gambar: "assets/img/innova.jpg" },
  { nama: "Honda HRV", harga: 600000, gambar: "assets/img/hrv.jpg" },
  { nama: "Daihatsu Sigra", harga: 450000, gambar: "assets/img/sigra.jpg" }
];

// Ambil div tempat daftar mobil akan ditempelkan
const container = document.getElementById("mobil-list");

// Render daftar mobil
mobilList.forEach((mobil, index) => {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <h3>${mobil.nama}</h3>
    <img src="${mobil.gambar}" alt="${mobil.nama}" />
    <p>Harga: Rp ${mobil.harga.toLocaleString()} / hari</p>
    <label><input type="checkbox" id="pilih-${index}"> Pilih</label><br>
    <label for="tgl-${index}">Tanggal:</label><br>
    <input type="date" id="tgl-${index}"><br>
    <label for="durasi-${index}">Durasi (hari):</label><br>
    <input type="number" id="durasi-${index}" min="1"><br>
  `;

  container.appendChild(card);
});


function hitungTotal() {
  const nama = document.getElementById("nama").value.trim();
  const ringkasanDiv = document.getElementById("ringkasan");
  ringkasanDiv.innerHTML = ""; // Bersihkan dulu

  if (nama === "") {
    alert("Nama pelanggan wajib diisi.");
    return;
  }

  let total = 0;
  let hasilHTML = `<h3>Ringkasan Pemesanan</h3><p><strong>Nama:</strong> ${nama}</p>`;

  mobilList.forEach((mobil, index) => {
    const dipilih = document.getElementById(`pilih-${index}`).checked;
    const tgl = document.getElementById(`tgl-${index}`).value;
    const durasi = parseInt(document.getElementById(`durasi-${index}`).value);

    if (dipilih) {
      if (!tgl || !durasi || durasi <= 0) {
        alert(`Mohon lengkapi data mobil: ${mobil.nama}`);
        return;
      }

      const subtotal = durasi * mobil.harga;
      total += subtotal;

      hasilHTML += `
        <div style="margin-bottom: 10px;">
          <p><strong>${mobil.nama}</strong><br>
          Tanggal: ${tgl}<br>
          Durasi: ${durasi} hari<br>
          Subtotal: Rp ${subtotal.toLocaleString()}</p>
        </div>
      `;
    }
  });

  if (total === 0) {
    alert("Pilih setidaknya satu mobil untuk dihitung.");
    return;
  }

  hasilHTML += `<h4>Total Harga: Rp ${total.toLocaleString()}</h4>`;
  ringkasanDiv.innerHTML = hasilHTML;
}

function simpanPemesanan() {
  const ringkasanHTML = document.getElementById("ringkasan").innerHTML;
  const waktu = new Date().toLocaleString();

  if (ringkasanHTML.trim() === "") {
    alert("Silakan hitung total pemesanan terlebih dahulu.");
    return;
  }

  const dataBaru = {
    waktu: waktu,
    isi: ringkasanHTML
  };

  let daftar = JSON.parse(localStorage.getItem("pemesanan")) || [];
  daftar.push(dataBaru);
  localStorage.setItem("pemesanan", JSON.stringify(daftar));

  alert("Pemesanan berhasil disimpan!");
  tampilkanPemesanan();
}

function tampilkanPemesanan() {
  const daftar = JSON.parse(localStorage.getItem("pemesanan")) || [];
  const container = document.getElementById("daftar-pemesanan");

  container.innerHTML = "<h3>Riwayat Pemesanan</h3>";

  if (daftar.length === 0) {
    container.innerHTML += "<p>Belum ada pemesanan tersimpan.</p>";
    return;
  }

  daftar.forEach((pesan, index) => {
    container.innerHTML += `
      <div class="card">
        <p><strong>Waktu:</strong> ${pesan.waktu}</p>
        ${pesan.isi}
      </div>
    `;
  });
}

// Tampilkan pesanan saat halaman dibuka
window.onload = tampilkanPemesanan;

function hapusPemesanan() {
  const konfirmasi = confirm("Yakin ingin menghapus semua pemesanan?");

  if (konfirmasi) {
    localStorage.removeItem("pemesanan");
    tampilkanPemesanan(); // refresh daftar
    alert("Semua pemesanan berhasil dihapus.");
  }
}
