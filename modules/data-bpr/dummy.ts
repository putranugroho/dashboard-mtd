import { BprProfile, BprTcodeItem } from "./types";

export const bprProfileDummyMap: Record<string, BprProfile> = {
  "609999": {
    bpr_id: "609999",
    nama_bpr: "BPR MTD Demo",
    alamat: "Jl. Demo Raya No. 10, Jakarta",
    direktur_nama: "Budi Santoso",
    direktur_hp: "081234567890",
    pic_nama: "Andi Pratama",
    pic_hp: "081298765432",
    head_teller_nama: "Sinta Dewi",
    head_teller_hp: "081277788899",
    email: "admin@bprmtd-demo.co.id",
    tanggal_bergabung: "2024-01-15",
    url_gateway: "https://gateway-demo.example.com",
    kode_pos: "10110",
    logo_bpr: "",
    is_active: true,
  },
};

export const bprTcodeDummyMap: Record<string, BprTcodeItem[]> = {
  "609999": [
    { tcode_id: 1, tcode: "2100", keterangan: "Transfer Out", is_linked: true },
    { tcode_id: 2, tcode: "2200", keterangan: "Transfer In", is_linked: true },
    { tcode_id: 3, tcode: "2300", keterangan: "Pindah Buku", is_linked: true },
    { tcode_id: 4, tcode: "4000", keterangan: "Buat Token Tarik Tunai", is_linked: false },
    { tcode_id: 5, tcode: "4100", keterangan: "Transaksi Tarik Tunai", is_linked: true },
    { tcode_id: 6, tcode: "5000", keterangan: "PPOB", is_linked: true },
  ],
};

export const allBprCodesDummy = Object.keys(bprProfileDummyMap);