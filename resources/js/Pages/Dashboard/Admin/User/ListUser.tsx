import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { DataTable } from "@/Components/Dashboard/Components/DataTable/DataTable";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import { toast } from 'react-toastify';
import { EditUserDialog } from '@/Components/Dashboard/Components/Admin/User/EditUserDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/Components/ui/alert-dialog";
import { PageProps, User } from '@/types';
import { generateColumns } from "@/Components/Dashboard/Components/DataTable/Components/Columns";
import axios from 'axios';

interface UserPageProps extends PageProps, Record<string, unknown> {
    user: User[];
}

const columnTitleMap: { [key: string]: string } = {
    nama: "Nama",
    email: "Email",
    no_telepon: "No. Telepon",
    role: "Role",
};

const UserPage = () => {
    const { user } = usePage<UserPageProps>().props;
    const [data, setData] = useState<User[]>(user);
    const [editData, setEditData] = useState<User | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [deleteData, setDeleteData] = useState<{ id: string; nama?: string } | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);


    const handleEdit = (id: string, data: User) => {
      setEditData(data);
      setIsEditDialogOpen(true);
    };

    const handleDelete = (id: string) => {
      const user = data.find((item) => item.id === id);
      setDeleteData({ id, nama: user?.nama });
      setIsDeleteDialogOpen(true);
    };

    const handleConfirmUpdate = async (id: string, formData: Partial<User>): Promise<void> => {
        try {
            const response = await axios.post(`/dashboard/admin/user/update/${id}`, formData);

            if (response.data.status === 'success') {
                setData((prevData) =>
                    prevData.map((item) => {
                        if (item.id === id) {
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
                toast.error('Gagal memperbarui user.');
            }
        }
    };

    const handleDeleteConfirm = async (id: string) => {
        try {
            const response = await axios.delete(`/dashboard/admin/user/delete/${id}`);

            if (response.data.status === 'success') {
                setData((prevData) => prevData.filter((item) => item.id !== id));
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

    const handleCopy = (data: any) => {
        const { id, created_at, updated_at, ...dataWithoutId } = data;

        toast.promise(
          // Fungsi yang mengembalikan promise
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

    const columns = generateColumns<User>(
        'user',
        columnTitleMap,
        undefined,
        undefined,
        handleEdit,
        handleCopy,
        handleDelete
    );

  return (
    <DashboardLayout>
      <Head title="User" />
      <Card className="w-full shadow-md overflow-x-auto">
        <CardHeader className="flex flex-col items-center text-base sm:text-xl font-semibold justify-between">
          <h2>Daftar User</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <DataTable
            data={data}
            columns={columns}
            columnTitleMap={columnTitleMap}
            name="User"
        />
        </CardContent>
      </Card>

      {editData && (
        <EditUserDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={(formData) => handleConfirmUpdate(editData.id, formData)}
          data={editData}
        />
      )}

      {isDeleteDialogOpen && deleteData && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Anda yakin ingin menghapus User {deleteData.nama}?</AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini tidak dapat dibatalkan. Ini akan menghapus User {deleteData.nama} secara permanen.
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

export default UserPage;
