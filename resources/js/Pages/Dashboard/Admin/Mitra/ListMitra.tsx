import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { DataTable } from "@/Components/Dashboard/Components/DataTable/DataTable";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import { toast } from 'react-toastify';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/Components/ui/alert-dialog";
import { PageProps, Mitra, User } from '@/types';
import { generateColumns } from "@/Components/Dashboard/Components/DataTable/Components/Columns";
import axios from 'axios';
import { CirclePlus, TriangleAlert } from 'lucide-react';
import { AddMitraDialog } from '@/Components/Dashboard/Components/Admin/Mitra/AddMitraDialog';
import { useEffect } from 'react';
import { EditMitraDialog } from '@/Components/Dashboard/Components/Admin/Mitra/EditMitraDialog';

interface MitraPageProps extends PageProps {
    mitra: Mitra[];
    users: User[];
}

const columnTitleMap: { [key: string]: string } = {
    nama: "Nama",
    no_telepon: "No Telepon",
    email: "Email",
    alamat: "Alamat",
};

const MitraPage = () => {
    // Props dari backend
    const { mitra, users } = usePage<MitraPageProps>().props;

    // State management
    const [data, setData] = useState(mitra);
    const [editData, setEditData] = useState<Mitra | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [deleteData, setDeleteData] = useState<{ id: string; nama?: string } | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState(users);

    // Mapping data mitra
    useEffect(() => {
        const flattenedData = mitra.map((item) => ({
            ...item,
            email: item.user?.email || "-",
            username: item.user?.username || "-",
        }));
        setData(flattenedData);
    }, [mitra]);

    // Fungsi Tambah mitra
    const handleAddMitra = async (formData: any) => {
        try {
            const response = await axios.post("/dashboard/admin/mitra/store", formData);

            // Jika sukses
            if (response.data.status === "success") {
                const newMitra = {
                    ...response.data.mitra,
                    email: response.data.mitra.user?.email || "-",
                    username: response.data.mitra.user?.username || "-",
                    no_telepon: response.data.mitra.no_telepon || "-", // Placeholder jika kosong
                    alamat: response.data.mitra.alamat || "-", // Placeholder jika kosong
                };

                // Update data mitra tanpa refresh halaman
                setData((prevData) => [...prevData, newMitra]);

                // Hapus user dari dropdown yang sudah dipilih
                setFilteredUsers((prevUsers) =>
                    prevUsers.filter((user) => String(user.id) !== String(formData.user_id))
                );

                toast.success(response.data.message);
                setIsAddDialogOpen(false); // Tutup modal
            } else {
                // Jika gagal validasi di backend
                toast.error(response.data.message || "Terjadi kesalahan.");
            }
        } catch (error: any) {
            console.error(error);

            // Tangani error jika user sudah memiliki mitra
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Gagal menambahkan mitra.");
            }
        }
    };

    const handleEdit = (id: string, data: Mitra) => {
        setEditData(data);
        setIsEditDialogOpen(true);
      };

    const handleDelete = (id: string) => {
        const mitra = data.find((item) => item.id === Number(id));
        setDeleteData({ id, nama: mitra?.nama });
        setIsDeleteDialogOpen(true);
    };

    async function fetchUsers(setFilteredUsers: any) {
        try {
            const userResponse = await axios.get('/dashboard/admin/option/user-available-list');
            setFilteredUsers(userResponse.data.users);
        } catch (error: any) {
            console.error('Error fetching users:', error);
        }
    }

    async function handleOpenAddDialog() {
        await fetchUsers(setFilteredUsers);
        setIsAddDialogOpen(true);
    }

    const handleConfirmUpdate = async (id: number, formData: Partial<Mitra>): Promise<void> => {
        try {
            const response = await axios.post(`/dashboard/admin/mitra/update/${id}`, formData);

            if (response.data.status === 'success') {
                setData((prevData) =>
                    prevData.map((item) => {
                        if (item.id === Number(id)) {
                            const updatedUser = { ...item, ...formData };
                            return updatedUser;
                        }
                        return item;
                    })
                );
                setIsEditDialogOpen(false);
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message || 'Terjadi kesalahan.');
            }
        } catch (error: any) {
            if (error.response && error.response.data.errors) {
                const errors = error.response.data.errors;
                const errorMessage = Object.values(errors).flat().join(', ');
                toast.error(`Gagal: ${errorMessage}`);
            } else {
                toast.error('Gagal memperbarui mitra.');
            }
        }
    };

    const handleCopy = (data: any) => {
        // Hilangkan properti id, created_at, dan updated_at
        const { id, created_at, updated_at, ...dataWithoutId } = data;

        toast.promise(
            () => navigator.clipboard.writeText(JSON.stringify(dataWithoutId)),
            {
                pending: 'Menyalin data ke clipboard...',
                success: 'Data berhasil disalin ke clipboard',
                error: {
                    render: (err) => `Gagal menyalin data ke clipboard: ${err}`,
                },
            }
        );
    };


    const handleDeleteConfirm = async (id: string) => {
        try {
            const response = await axios.delete(`/dashboard/admin/mitra/delete/${id}`);

            if (response.data.status === 'success') {
                setData((prevData) => prevData.filter((item) => item.id !== Number(id)));
                setIsDeleteDialogOpen(false);
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message || 'Terjadi kesalahan.');
            }
        } catch (error: any) {
            if (error.response && error.response.data.errors) {
                const errors = error.response.data.errors;
                const errorMessage = Object.values(errors).flat().join(', ');
                toast.error(`Gagal: ${errorMessage}`);
            } else {
                toast.error('Gagal menghapus user.');
            }
        }
    };

    // Definisikan kolom tabel
    const columns = generateColumns(
        'mitra',
        columnTitleMap,
        undefined,
        undefined,
        undefined,
        handleEdit,
        handleCopy,
        handleDelete
    );

    // Render Komponen
    return (
        <DashboardLayout>
            <Head title="mitra" />
            <Card className="w-full shadow-md overflow-x-auto">
                <CardHeader className="flex flex-col items-center text-base sm:text-xl font-semibold justify-between">
                    <h2>Daftar Mitra</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-end">
                        <Button
                            className="gap-1 flex items-center justify-center"
                            onClick={handleOpenAddDialog}
                        >
                            <CirclePlus className="h-4 w-4" />
                            {/* Tambah mitra */}
                        </Button>
                    </div>
                    <DataTable
                        key={data.length}
                        data={data}
                        columns={columns}
                        columnTitleMap={columnTitleMap}
                        name="mitra"
                    />
                </CardContent>
            </Card>

            {/* Modal Tambah mitra */}
            <AddMitraDialog
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                onSave={handleAddMitra}
                users={filteredUsers}
            />

            {editData && (
                <EditMitraDialog
                    isOpen={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    onSave={(formData) => handleConfirmUpdate(editData.id, formData)}
                    data={editData}
                />
            )}

            {isDeleteDialogOpen && deleteData && (
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader className='flex flex-col items-center'>
                        <AlertDialogTitle className='text-center'>Anda yakin ingin menghapus mitra {deleteData.nama}?</AlertDialogTitle>
                        <div>
                            <TriangleAlert className='h-32 w-32 text-red-500' />
                        </div>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus mitra {deleteData.nama} secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteData && handleDeleteConfirm(deleteData.id)}>
                        Lanjutkan
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            )}
        </DashboardLayout>
    );
};

export default MitraPage;
