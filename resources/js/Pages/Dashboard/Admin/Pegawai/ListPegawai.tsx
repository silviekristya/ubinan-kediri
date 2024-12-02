import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { DataTable } from "@/Components/Dashboard/Components/DataTable/DataTable";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import { toast } from 'react-toastify';
import { EditUserDialog } from '@/Components/Dashboard/Components/Admin/User/EditUserDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/Components/ui/alert-dialog";
import { PageProps, Pegawai } from '@/types';
import { generateColumns } from "@/Components/Dashboard/Components/DataTable/Components/Columns";
import axios from 'axios';
import { CirclePlus } from 'lucide-react';
import AddUserDialog from '@/Components/Dashboard/Components/Admin/User/AddUserDialog';

interface PegawaiPageProps extends PageProps {
    pegawai: Pegawai[];
}

const columnTitleMap: { [key: string]: string } = {
    nama: "Nama",
    role: "Role",
    no_telepon: "No Telepon",
    email: "Email",
    username: "Username",
    is_pml_text: "PML",
};
import { useEffect } from 'react';

const PegawaiPage = () => {
    const { pegawai } = usePage<PegawaiPageProps>().props;
    const [data, setData] = useState(pegawai);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    useEffect(() => {
        const flattenedData = pegawai.map((item) => ({
            ...item,
            email: item.user?.email || "-",
            username: item.user?.username || "-",
            is_pml_text: item.is_pml ? "Ya" : "Tidak", // Tambahkan properti baru untuk tampilan
        }));
        setData(flattenedData);
        console.log(flattenedData);
    }, [pegawai]);


    const handleAddPegawai = async (formData: any) => {
        try {
            const response = await axios.post("/dashboard/admin/pegawai/create", formData);

            if (response.data.status === "success") {
                setData((prevData) => [...prevData, response.data.pegawai]);
                toast.success(response.data.message);
                setIsAddDialogOpen(false);
            } else {
                toast.error(response.data.message || "Terjadi kesalahan.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Gagal menambahkan pegawai.");
        }
    };

    const columns = generateColumns(
        'pegawai',
        columnTitleMap,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
    );

    return (
        <DashboardLayout>
            <Head title="Pegawai" />
            <Card className="w-full shadow-md overflow-x-auto">
                <CardHeader className="flex flex-col items-center text-base sm:text-xl font-semibold justify-between">
                    <h2>Daftar Pegawai</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-end">
                        <Button
                            className="gap-1 flex items-center justify-center"
                            onClick={() => setIsAddDialogOpen(true)}
                        >
                            <CirclePlus className="h-4 w-4" />
                            Tambah Pegawai
                        </Button>
                    </div>
                    <DataTable
                        data={data}
                        columns={columns}
                        columnTitleMap={columnTitleMap}
                        name="Pegawai"
                    />
                </CardContent>
            </Card>

            <AddUserDialog
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                onSave={handleAddPegawai}
            />
        </DashboardLayout>
    );
};

export default PegawaiPage;

