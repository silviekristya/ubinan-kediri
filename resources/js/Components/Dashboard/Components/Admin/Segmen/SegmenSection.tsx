import React, { useState } from 'react';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { DataTable } from '@/Components/Dashboard/Components/DataTable/DataTable';
import { CirclePlus } from 'lucide-react';
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

interface SegmenSectionProps {
  segmenData: Segmen[];
  setSegmenData: React.Dispatch<React.SetStateAction<Segmen[]>>;
  canEditDelete: boolean; // Boleh edit/hapus?
}

const SegmenSection: React.FC<SegmenSectionProps> = ({
  segmenData,
  setSegmenData,
  canEditDelete,
}) => {
  // Dialog Tambah/Edit
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editSegmen, setEditSegmen] = useState<Segmen | null>(null);

  // Dialog Hapus
  const [deleteData, setDeleteData] = useState<{ id_segmen: string; nama_segmen: string } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Handler CRUD
  const handleAddSegmen = async (formData: any) => {
    try {
      const response = await axios.post('/dashboard/admin/segmen-blok-sensus/segmen/store', formData);
      if (response.data.status === 'success') {
        setSegmenData((prev) => [...prev, response.data.newSegmen]);
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

  const handleEditSegmen = (item: Segmen) => {
    setEditSegmen(item);
    setIsEditDialogOpen(true);
  };

  const handleConfirmUpdateSegmen = async (id: string, formData: Partial<Segmen>) => {
    try {
      const response = await axios.post(`/dashboard/admin/segmen-blok-sensus/segmen/update/${id}`, formData);
      if (response.data.status === 'success') {
        setSegmenData((prev) =>
          prev.map((seg) => (seg.id_segmen === id ? { ...seg, ...formData } : seg))
        );
        toast.success('Berhasil memperbarui segmen!');
        setIsEditDialogOpen(false);
      } else {
        toast.error(response.data.message || 'Terjadi kesalahan.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Gagal memperbarui segmen.');
    }
  };

  const handleDeleteSegmen = (id: string) => {
    const item = segmenData.find((s) => s.id_segmen === id);
    if (item) {
      setDeleteData({ id_segmen: item.id_segmen, nama_segmen: item.nama_segmen });
    }
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDeleteSegmen = async (id: string) => {
    try {
      const response = await axios.delete(`/dashboard/admin/segmen-blok-sensus/segmen/delete/${id}`);
      if (response.data.status === 'success') {
        setSegmenData((prev) => prev.filter((seg) => seg.id_segmen !== id));
        toast.success('Berhasil menghapus segmen!');
        setIsDeleteDialogOpen(false);
      } else {
        toast.error(response.data.message || 'Terjadi kesalahan.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Gagal menghapus segmen.');
    }
  };

  // Kolom DataTable
  const segmenColumns = [
    { accessorKey: 'id_segmen', header: 'ID Segmen' },
    { accessorKey: 'nama_segmen', header: 'Nama Segmen' },
    {
      id: 'aksi',
      header: 'Aksi',
      cell: ({ row }: any) => {
        const rowData = row.original as Segmen;
        return (
          <div className="flex space-x-2">
            {canEditDelete ? (
              <>
                <Button variant="outline" size="sm" onClick={() => handleEditSegmen(rowData)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteSegmen(rowData.id_segmen)}>
                  Hapus
                </Button>
              </>
            ) : (
              <span className="text-gray-400 text-sm">Tidak ada aksi</span>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      {/* Bagian atas Tabel */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
        <Input type="search" placeholder="Cari..." className="sm:w-1/2" />
        <div className="flex items-center gap-2">
          <Button variant="outline">Unduh</Button>
          <Button variant="outline">Unggah</Button>
          {canEditDelete && (
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-1 flex items-center">
              <CirclePlus className="h-4 w-4" />
              Tambah
            </Button>
          )}
        </div>
      </div>

      {/* Tabel Segmen */}
      <DataTable 
        data={segmenData} 
        columns={segmenColumns} 
        columnTitleMap={{ id_segmen: 'ID Segmen', nama_segmen: 'Nama Segmen', aksi: 'Aksi' }} 
        name="segmen" 
      />

      {/* Dialog Tambah */}
      <AddSegmenDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleAddSegmen}
      />

      {/* Dialog Edit */}
      {editSegmen && (
        <EditSegmenDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          segmen={editSegmen}
          onSave={(formData) => handleConfirmUpdateSegmen(editSegmen.id_segmen, formData)}
        />
      )}

      {/* Dialog Hapus */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader className="flex flex-col items-center">
            <AlertDialogTitle className="text-center">
              Hapus segmen {deleteData?.nama_segmen}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteData && handleConfirmDeleteSegmen(deleteData.id_segmen)}
            >
              Lanjutkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SegmenSection;
