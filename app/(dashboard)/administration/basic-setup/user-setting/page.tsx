"use client";

import { useState } from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

const users = [
    {
        id: 1,
        name: "Budi Santoso",
        username: "budi",
        role: "Admin",
        status: "Active",
    },
    {
        id: 2,
        name: "Siti Aminah",
        username: "siti",
        role: "Manager",
        status: "Active",
    },
];

const employees = [
    { id: 1, name: "Budi Santoso" },
    { id: 2, name: "Siti Aminah" },
    { id: 3, name: "Ahmad Wijaya" },
    { id: 4, name: "Dewi Lestari" },
];

export default function UserSettingPage() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [selected, setSelected] = useState<any>(null);
    const [employee, setEmployee] = useState<any>(null);

    const total = users.length;
    const totalPages = Math.ceil(total / limit);

    const paginatedData = users.slice(
        (page - 1) * limit,
        page * limit
    );
    return (
        <div className="p-6 space-y-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">User Settings</h1>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button className="bg-black text-white px-4 py-2 rounded-lg">
                            + Tambah User
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="right" className="                    w-full sm:w-[520px]
                        mr-3 sm:mr-6
                        rounded-2xl
                        shadow-2xl
                        border
                        overflow-y-auto
                        bg-white
                        p-6
                    ">
                        <SheetHeader>
                            <SheetTitle>Tambah User</SheetTitle>
                        </SheetHeader>

                        <div className="p-4 space-y-3">
                            <EmployeeSelect
                                value={employee}
                                onChange={setEmployee}
                            />

                            <Input placeholder="Username" />

                            <Input type="password" placeholder="Password" />

                            <select className="w-full border rounded p-2">
                                <option>Admin</option>
                                <option>Manager</option>
                                <option>Staff</option>
                            </select>

                            <select className="w-full border rounded p-2">
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>

                            <Button className="w-full bg-green-600">
                                Save
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* TABLE */}
            <div className="bg-white border rounded-xl overflow-hidden">
                <Table className="w-full text-sm">
                    <TableHeader className="border-b">
                        <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead>Username</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((u) => (
                            <Sheet key={u.id}>
                                <SheetTrigger asChild>
                                    <TableRow
                                        className="cursor-pointer"
                                        onClick={() => setSelected(u)}
                                    >
                                        <TableCell>{u.name}</TableCell>
                                        <TableCell>{u.username}</TableCell>
                                        <TableCell>{u.role}</TableCell>
                                        <TableCell className="text-green-600">
                                            {u.status}
                                        </TableCell>
                                    </TableRow>
                                </SheetTrigger>
                                <SheetContent
                                    side="right"
                                    className="w-[420px] sm:w-[500px] overflow-y-auto"
                                >
                                    <SheetHeader>
                                        <SheetTitle>Detail User</SheetTitle>
                                    </SheetHeader>

                                    <div className="p-4 space-y-3">
                                        <Input defaultValue={u.name} />
                                        <Input defaultValue={u.username} />
                                        <Input type="password" placeholder="••••••" />

                                        <select className="w-full border rounded p-2">
                                            <option>{u.role}</option>
                                        </select>

                                        <select className="w-full border rounded p-2">
                                            <option>{u.status}</option>
                                        </select>

                                        <Button className="w-full bg-green-600">
                                            Update
                                        </Button>
                                    </div>
                                </SheetContent>
                                {/* SheetContent tetap */}
                            </Sheet>
                        ))}
                    </TableBody>


                </Table>
                <div className="border-t pt-4 flex justify-between items-center p-4 text-sm">
                    <span>
                        Showing {(page - 1) * limit + 1} -{" "}
                        {Math.min(page * limit, total)} of {total}
                    </span>

                    <div className="flex items-center gap-2">
                        <select className="border px-2 py-1 rounded">
                            <option>5</option>
                        </select>
                        <button className="border px-3 py-1 rounded">Prev</button>
                        <span>1 / 1</span>
                        <button className="border px-3 py-1 rounded">Next</button>
                    </div>
                </div>
            </div>

        </div >
    );
}


export function EmployeeSelect({
    value,
    onChange,
}: {
    value: any;
    onChange: (val: any) => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full justify-between"
                >
                    {value ? value.name : "Pilih Karyawan"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Cari karyawan..." />

                    <CommandList>
                        <CommandEmpty>Tidak ditemukan</CommandEmpty>

                        {employees.map((emp) => (
                            <CommandItem
                                key={emp.id}
                                value={emp.name}
                                onSelect={() => {
                                    onChange(emp);
                                    setOpen(false);
                                }}
                            >
                                <Check
                                    className={`mr-2 h-4 w-4 ${value?.id === emp.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                        }`}
                                />
                                {emp.name}
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}