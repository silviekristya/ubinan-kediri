import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { DataTable } from "@/Components/Dashboard/Components/DataTable/DataTable";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import { toast } from 'react-toastify';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/Components/ui/alert-dialog";
import { PageProps, Tim, Pegawai, Mitra } from '@/types';
import { generateColumns } from "@/Components/Dashboard/Components/DataTable/Components/Columns";
import axios from 'axios';
import { CirclePlus, TriangleAlert } from 'lucide-react';
import { AddTimDialog } from '@/Components/Dashboard/Components/Admin/Tim/AddTimDialog';
import { useEffect } from 'react';
import { EditTimDialog } from '@/Components/Dashboard/Components/Admin/Tim/EditTimDialog';

interface TimPageProps extends PageProps {
    tim: Tim[];
    pegawai: Pegawai[];
    mitra: Mitra[];
}

const columnTitleMap: { [key: string]: string } = {
    nama_tim: "Nama Tim",
    pml: "PML",
    ppl_count: "Jumlah PPL",
};

const TimPage = () => {
    const { tim, pegawai, mitra } = usePage<TimPageProps>().props;

    const [data, setData] = useState<Tim[]>(tim);
    const [editData, setEditData] = useState<Tim | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [deleteData, setDeleteData] = useState<{ id: string; nama?: string } | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [filteredPegawai, setFilteredPegawai] = useState(pegawai);
    const [filteredMitra, setFilteredMitra] = useState(mitra);

    useEffect(() => {
        const flattenedData: Tim[] = tim.map((item) => ({
            ...item,
            pml: item.pml || null, // Atasi undefined dengan null
            ppl: item.ppl || [],   // Atasi undefined dengan array kosong
        }));
        setData(flattenedData);

    }, [tim]);

    async function fetchOptions(timId?: number) {
        try {
            // Jika timId ada, gunakan untuk filter PML dan PPL berdasarkan tim tersebut
            const pmlResponse = await axios.get('/dashboard/admin/option/pml-available-list', {
                params: timId ? { tim_id: timId } : {}, // Tambahkan tim_id jika ada
            });

            const pplResponse = await axios.get('/dashboard/admin/option/ppl-available-list', {
                params: timId ? { tim_id: timId } : {}, // Tambahkan tim_id jika ada
            });

            // Set data yang difilter
            setFilteredPegawai(pmlResponse.data.pegawai || []);
            setFilteredMitra(pplResponse.data.mitra || []);
        } catch (error: any) {
            console.error('Error fetching options:', error);
            toast.error('Gagal mengambil data opsi.');
        }
    }

    async function handleOpenAddDialog() {
        await fetchOptions();
        setIsAddDialogOpen(true);
    }

    const handleAddTim = async (formData: any) => {
        try {
            const response = await axios.post("/dashboard/admin/tim/store", formData);

            if (response.data.status === "success") {
                const newTim: Tim = {
                    ...response.data.tim,
                    pml: response.data.tim.pml || null,
                    ppl: response.data.tim.ppl || [],
                };

                setData((prevData) => [...prevData, newTim]);

                toast.success(response.data.message);
                setIsAddDialogOpen(false);
            } else {
                toast.error(response.data.message || "Terjadi kesalahan.");
            }
        } catch (error: any) {
            console.error(error);
            toast.error("Gagal menambahkan tim.");
        }
    };

    const handleEdit = async (id: string, data: Tim) => {
        setEditData(data);
        await fetchOptions(data.id);
        setIsEditDialogOpen(true);
    };


    const handleConfirmUpdate = async (id: number, formData: Partial<Tim>): Promise<void> => {
        try {
            const response = await axios.post(`/dashboard/admin/tim/update/${id}`, formData);

            if (response.data.status === 'success') {
                setData((prevData) =>
                    prevData.map((item) => {
                        if (item.id === Number(id)) {
                            const updatedTim = {
                                ...item,
                                ...response.data.tim,
                                pml: response.data.tim.pml || null,
                                ppl: response.data.tim.ppl || [],
                            };
                            return updatedTim;
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
                toast.error('Gagal memperbarui tim.');
            }
        }
    };

    const handleDelete = (id: string) => {
        const tim = data.find((item) => item.id === Number(id));
        setDeleteData({ id, nama: tim?.nama_tim });
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async (id: string) => {
        try {
            const response = await axios.delete(`/dashboard/admin/tim/delete/${id}`);

            if (response.data.status === 'success') {
                setData((prevData) => prevData.filter((item) => item.id !== Number(id)));
                setIsDeleteDialogOpen(false);
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message || 'Terjadi kesalahan.');
            }
        } catch (error: any) {
            toast.error('Gagal menghapus tim.');
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

    const columns = generateColumns(
        'tim',
        columnTitleMap,
        undefined,
        undefined,
        handleEdit,
        handleCopy,
        handleDelete
    );

    return (
        <DashboardLayout>
            <Head title="Tim" />
            <Card className="w-full shadow-md overflow-x-auto">
                <CardHeader className="flex flex-col items-center text-base sm:text-xl font-semibold justify-between">
                    <h2>Daftar Tim</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-end">
                        <Button
                            className="gap-1 flex items-center justify-center"
                            onClick={handleOpenAddDialog}
                        >
                            <CirclePlus className="h-4 w-4" />
                        </Button>
                    </div>
                    <DataTable
                        key={data.length}
                        data={data}
                        columns={columns}
                        columnTitleMap={columnTitleMap}
                        name="Tim"
                    />
                </CardContent>
            </Card>

            <AddTimDialog
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                onSave={handleAddTim}
                pegawai={filteredPegawai}
                mitra={filteredMitra}
            />

            {editData && (
                <EditTimDialog
                    isOpen={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    onSave={(formData) => handleConfirmUpdate(editData.id, { ...formData, pml_id: Number(formData.pml_id) })}
                    data={editData}
                    pegawai={filteredPegawai}
                    mitra={filteredMitra}
                />
            )}

            {isDeleteDialogOpen && deleteData && (
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader className='flex flex-col items-center'>
                            <AlertDialogTitle className='text-center'>Anda yakin ingin menghapus tim {deleteData.nama}?</AlertDialogTitle>
                            <div>
                                <TriangleAlert className='h-32 w-32 text-red-500' />
                            </div>
                            <AlertDialogDescription>
                                Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteConfirm(deleteData.id)}>Hapus</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </DashboardLayout>
    );
};

export default TimPage;
