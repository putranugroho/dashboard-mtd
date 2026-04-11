"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MasterBlokSheet } from "./sheet";

// 🔥 DUMMY DATA
const dummyBlok = [
  {
    id: 1,
    kode: "BLK-001",
    tahun: 2020,
    luas: 25,
    pokok: 3000,
    bibit: "DxP",
    status: "Active",
  },
  {
    id: 2,
    kode: "BLK-002",
    tahun: 2018,
    luas: 18,
    pokok: 2500,
    bibit: "Socfindo",
    status: "Inactive",
  },
];

export default function MasterBlokPage() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Master Blok</h1>
        <Button onClick={() => setOpen(true)}>+ Tambah Blok</Button>
      </div>

      {/* TABLE */}
      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode Blok</TableHead>
              <TableHead>Tahun Tanam</TableHead>
              <TableHead>Luas (Ha)</TableHead>
              <TableHead>Jumlah Pokok</TableHead>
              <TableHead>Jenis Bibit</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {dummyBlok.map((item) => (
              <TableRow
                key={item.id}
                className="cursor-pointer"
                onClick={() => {
                  setSelected(item);
                  setOpen(true);
                }}
              >
                <TableCell>{item.kode}</TableCell>
                <TableCell>{item.tahun}</TableCell>
                <TableCell>{item.luas}</TableCell>
                <TableCell>{item.pokok}</TableCell>
                <TableCell>{item.bibit}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      item.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }
                  >
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* PAGINATION */}
        <div className="flex justify-between items-center px-4 py-4 border-t">
          <span className="text-sm text-gray-500">
            Showing 1 - {dummyBlok.length} of {dummyBlok.length}
          </span>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Prev
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* SHEET */}
      <MasterBlokSheet open={open} setOpen={setOpen} data={selected} />
    </div>
  );
}