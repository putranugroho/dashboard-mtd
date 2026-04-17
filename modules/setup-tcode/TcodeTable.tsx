"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TcodeItem } from "./types";

type Props = {
  data: TcodeItem[];
  onEdit: (item: TcodeItem) => void;
  onDelete: (item: TcodeItem) => void;
};

export default function TcodeTable({ data, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[140px]">Kode</TableHead>
            <TableHead>Keterangan</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead className="w-[140px]">Status</TableHead>
            <TableHead className="w-[200px] text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-10 text-center text-sm text-gray-500"
              >
                Data TCode belum tersedia
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.tcode}</TableCell>
                <TableCell>{item.keterangan}</TableCell>
                <TableCell className="max-w-[360px] truncate text-gray-600">
                  {item.description || "-"}
                </TableCell>
                <TableCell>
                  <Badge variant={item.is_active ? "default" : "outline"}>
                    {item.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(item)}
                    >
                      Hapus
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}