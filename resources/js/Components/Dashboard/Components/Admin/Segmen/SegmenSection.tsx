import React, { useState, useEffect } from 'react';
import { Button } from '@/Components/ui/button';
import { DataTable } from '@/Components/Dashboard/Components/DataTable/DataTable';
import { CirclePlus, TriangleAlert } from 'lucide-react';
import { Segmen } from '@/types';
import { AddSegmenDialog } from '@/Components/Dashboard/Components/Admin/Segmen/AddSegmenDialog';
import { EditSegmenDialog } from '@/Components/Dashboard/Components/Admin/Segmen/EditSegmenDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/Components/ui/alert-dialog';
import { toast } from 'react-toastify';
import axios from 'axios';
import { generateColumns } from '@/Components/Dashboard/Components/DataTable/Components/Columns';

interface SegmenSectionProps {
  segmenData: Segmen[];
  setSegmenData: React.Dispatch<React.SetStateAction<Segmen[]>>;
  canEditDelete: boolean;
}

const columnTitleMap: { [key: string]: string } = {
  id_segmen: 'Kode Segmen',
  nama_segmen: 'Nama Segmen',
  nama_kecamatan: 'Kecamatan',
};

const SegmenSection: React.FC<SegmenSectionProps> = ({
  segmenData,
  setSegmenData,
  canEditDelete,
}) => {
  const [data, setData] = useState<Segmen[]>(segmenData);
  const [editData, setEditData] = useState<Segmen | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteData, setDeleteData] = useState<{ id: string; nama?: string } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    setData(segmenData);
  }, [segmenData]);

  const handleAddSegmen = async (formData: any) => {
    try {
      const response = await axios.post('/dashboard/admin/wilayah/segmen/store', formData);
      if (response.data.status === 'success') {
        const newSegmen = response.data.data;
        setSegmenData((prev) => [...prev, newSegmen]);
        toast.success('Berhasil menambah segmen!');
        setIsAddDialogOpen(false);
      } else {
        toast.error(response.data.message || 'Terjadi kesalahan.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Gagal menambahkan segmen.');
    }
  };

  const handleEdit = (id: string, data: Segmen) => {
    // console.log("EDIT TRIGGERED", id); // ← DEBUG log
    setEditData(data);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const segmen = data.find((item) => item.id_segmen === id);
    setDeleteData({ id, nama: segmen?.nama_segmen });
    setIsDeleteDialogOpen(true);
  };

  const handleCopy = (data: any) => {
    const { id_segmen, created_at, updated_at, ...copyData } = data;
    toast.promise(
      () => navigator.clipboard.writeText(JSON.stringify(copyData)),
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
      const response = await axios.delete(`/dashboard/admin/wilayah/segmen/delete/${id}`);
      if (response.data.status === 'success') {
        setSegmenData((prevData) => prevData.filter((item) => item.id_segmen !== id));
        setIsDeleteDialogOpen(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || 'Terjadi kesalahan.');
      }
    } catch (error: any) {
      if (error.response && error.response.data.errors) {
        const errorMessage = Object.values(error.response.data.errors).flat().join(', ');
        toast.error(`Gagal: ${errorMessage}`);
      } else {
        toast.error('Gagal menghapus segmen.');
      }
    }
  };

  const handleConfirmUpdate = async (id: string, formData: Partial<Segmen>) => {
    try {
      const response = await axios.post(`/dashboard/admin/wilayah/segmen/update/${id}`, formData);
      if (response.data.status === 'success') {
        setSegmenData((prevData) =>
          prevData.map((item) => (item.id_segmen === id ? { ...item, ...formData } : item))
        );
        setIsEditDialogOpen(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || 'Terjadi kesalahan.');
      }
    } catch (error: any) {
      if (error.response && error.response.data.errors) {
        const errorMessage = Object.values(error.response.data.errors).flat().join(', ');
        toast.error(`Gagal: ${errorMessage}`);
      } else {
        toast.error('Gagal memperbarui segmen.');
      }
    }
  };

  const columns = generateColumns(
    'segmen',
    columnTitleMap,
    undefined,
    undefined,
    undefined,
    handleEdit,
    handleCopy,
    handleDelete,
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {canEditDelete && (
          <Button className="gap-1 flex items-center justify-center" onClick={() => setIsAddDialogOpen(true)}>
            <CirclePlus className="h-4 w-4" />
            Tambah
          </Button>
        )}
      </div>
      <DataTable
        // key={data.length}
        data={data.map(item => ({ ...item, id: item.id_segmen }))}
        columns={columns}
        columnTitleMap={columnTitleMap}
        name="segmen"
      />

      <AddSegmenDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleAddSegmen}
      />

      {editData && (
        <EditSegmenDialog
          isOpen={isEditDialogOpen}
          onClose={() => {setIsEditDialogOpen(false); setEditData(null);}}
          segmen={editData!}
          onSave={(formData) => handleConfirmUpdate(editData!.id_segmen, formData)}
        />
      )}

      {isDeleteDialogOpen && deleteData && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader className="flex flex-col items-center">
              <AlertDialogTitle className="text-center">
                Anda yakin ingin menghapus segmen {deleteData.nama}?
              </AlertDialogTitle>
              <div>
                <TriangleAlert className="h-32 w-32 text-red-500" />
              </div>
              <AlertDialogDescription>
                Tindakan ini tidak dapat dibatalkan. Ini akan menghapus segmen {deleteData.nama} secara permanen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
                Batal
              </AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteData && handleDeleteConfirm(deleteData.id)}>
                Lanjutkan
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default SegmenSection;
