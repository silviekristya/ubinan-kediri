import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { DataTable } from "@/Components/Dashboard/Components/DataTable/DataTable";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import { toast } from 'react-toastify';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import axios from 'axios';
import { CirclePlus, Trash2, Copy } from 'lucide-react';
import { generateColumns } from "@/Components/Dashboard/Components/DataTable/Components/Columns";
import { AddTemplatePesanDialog } from '@/Components/Dashboard/Components/Admin/TemplatePesan/AddTemplatePesanDialog';
import { EditTemplatePesanDialog } from '@/Components/Dashboard/Components/Admin/TemplatePesan/EditTemplatePesanDialog';
import { PageProps } from '@/types';

interface TemplatePesan {
  id: number;
  nama_template: string;
  text: string;
}

interface TemplatePesanPageProps extends PageProps {
  templatePesan: TemplatePesan[];
}

const columnTitleMap = {
  nama_template: 'Nama Template',
  text: 'Isi Template',
};

const ListTemplatePesan = () => {
  const { templatePesan } = usePage<TemplatePesanPageProps>().props;

  const [data, setData] = useState<TemplatePesan[]>([]);
  const [editData, setEditData] = useState<TemplatePesan | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteData, setDeleteData] = useState<{ id: number; nama?: string } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    setData(templatePesan);
  }, [templatePesan]);

  async function handleAddTemplatePesan(formData: { nama: string; isi: string; _token: string }) {
    try {
      const response = await axios.post('/dashboard/admin/template-pesan/store', formData, {
        headers: { Accept: 'application/json' },
      });
      if (response.data.status === 'success') {
        const newTpl: TemplatePesan = response.data.data;
        setData(prev => [...prev, newTpl]);
        toast.success(response.data.message);
        setIsAddDialogOpen(false);
      } else {
        toast.error(response.data.message || 'Gagal menambahkan template.');
      }
    } catch (error: any) {
      console.error(error);
      toast.error('Gagal menambahkan template.');
      throw error;
    }
  }

  function handleEdit(id: string, tpl: TemplatePesan) {
    setEditData(tpl);
    setIsEditDialogOpen(true);
  }

  async function handleConfirmUpdate(id: number, formData: { nama: string; isi: string; _token: string }) {
    try {
      const response = await axios.post(`/dashboard/admin/template-pesan/update/${id}`, formData, {
        headers: { Accept: 'application/json' },
      });
      if (response.data.status === 'success') {
        setData(prev =>
          prev.map(item =>
            item.id === id ? response.data.data : item
          )
        );
        toast.success(response.data.message);
        setIsEditDialogOpen(false);
      } else {
        toast.error(response.data.message || 'Gagal memperbarui template.');
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const errs = Object.values(error.response.data.errors).flat().join(', ');
        toast.error(`Gagal: ${errs}`);
      } else {
        toast.error('Gagal memperbarui template.');
      }
    }
  }

  function handleDelete(id: string) {
    const tpl = data.find(item => item.id === Number(id));
    setDeleteData({ id: Number(id), nama: tpl?.nama_template });
    setIsDeleteDialogOpen(true);
  }

  async function handleDeleteConfirm(id: number) {
    try {
      const response = await axios.delete(`/dasboard/admin/template-pesan/delete/${id}`, {
        headers: { Accept: 'application/json' },
      });
      if (response.data.status === 'success') {
        setData(prev => prev.filter(item => item.id !== id));
        toast.success(response.data.message);
        setIsDeleteDialogOpen(false);
      } else {
        toast.error(response.data.message || 'Gagal menghapus template.');
      }
    } catch {
      toast.error('Gagal menghapus template.');
    }
  }

  function handleCopy(item: TemplatePesan) {
    const { id, ...rest } = item;
    toast.promise(
      navigator.clipboard.writeText(JSON.stringify(rest)),
      {
        pending: 'Menyalin template ke clipboard...',
        success: 'Berhasil disalin!',
        error: 'Gagal menyalin.',
      }
    );
  }

  const columns = generateColumns(
    'templatePesan',
    columnTitleMap,
    undefined,
    undefined,
    undefined,
    handleEdit,
    handleCopy,
    handleDelete
  );

  return (
    <DashboardLayout>
      <Head title="Template Pesan" />
      <Card className="w-full shadow-md overflow-x-auto">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Daftar Template Pesan</h2>
        </CardHeader>
        <CardContent>
            <div className="flex justify-end mb-4">
                <Button
                    className="gap-1 flex items-center justify-center"
                    onClick={() => setIsAddDialogOpen(true)}
                >
                    <CirclePlus className="h-4 w-4" /> 
                    Tambah Template Pesan
                </Button>
            </div>
          <DataTable
            key={data.length}
            data={data}
            columns={columns}
            columnTitleMap={columnTitleMap}
            name="TemplatePesan"
          />
        </CardContent>
      </Card>

      <AddTemplatePesanDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleAddTemplatePesan}
      />

      {editData && (
        <EditTemplatePesanDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onUpdate={handleConfirmUpdate}
          template={editData}
        />
      )}

      {isDeleteDialogOpen && deleteData && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Hapus Template "{deleteData.nama}"?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
                Batal
              </AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDeleteConfirm(deleteData.id)}>
                <Trash2 className="mr-1 h-4 w-4" /> Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </DashboardLayout>
  );
};

export default ListTemplatePesan;
