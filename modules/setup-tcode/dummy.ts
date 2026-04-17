import { TcodeItem } from "./types";

export const tcodeDummyData: TcodeItem[] = [
  {
    id: 1,
    tcode: "2100",
    keterangan: "Transfer Out",
    description: "Transaksi transfer keluar",
    is_active: true,
  },
  {
    id: 2,
    tcode: "2200",
    keterangan: "Transfer In",
    description: "Transaksi transfer masuk",
    is_active: true,
  },
  {
    id: 3,
    tcode: "2300",
    keterangan: "Pindah Buku",
    description: "Transaksi pindah buku antar rekening",
    is_active: true,
  },
  {
    id: 4,
    tcode: "4000",
    keterangan: "Buat Token Tarik Tunai",
    description: "Generate token tarik tunai",
    is_active: true,
  },
  {
    id: 5,
    tcode: "4100",
    keterangan: "Transaksi Tarik Tunai",
    description: "Eksekusi transaksi tarik tunai",
    is_active: true,
  },
  {
    id: 6,
    tcode: "5000",
    keterangan: "PPOB",
    description: "Pembayaran PPOB",
    is_active: true,
  },
];