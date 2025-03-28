import React, { useState } from 'react';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { DataTable } from '@/Components/Dashboard/Components/DataTable/DataTable';
import { CirclePlus } from 'lucide-react';
import { BlokSensus } from '@/types';
import { AddBlokSensusDialog } from '@/Components/Dashboard/Components/Admin/BlokSensus/AddBlokSensusDialog';
import { EditBlokSensusDialog } from '@/Components/Dashboard/Components/Admin/BlokSensus/EditBlokSensusDialog';
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

interface BlokSensusSectionProps {
  blokData: BlokSensus[];
  setBlokData: React.Dispatch<React.SetStateAction<BlokSensus[]>>;
  canEditDelete: boolean; // Boleh edit/hapus?
}

const BlokSensusSection: React.FC<BlokSensusSectionProps> = ({
  blokData,
  setBlokData,
  canEditDelete,
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editBlok, setEditBlok] = useState<BlokSensus | null>(null);
  const [deleteData, setDeleteData] = useState<{ id: number; nomor?: string } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // CRUD
  const handleAddBlok = async (formData: any) => {
    try {
      const response = await axios.post('/dashboard/admin/segmen-blok-sensus/blok-sensus/store', formData);
      if (response.data.status === 'success') {
        setBlokData((prev) => [...prev, response.data.newBlokSensus]);
        toast.success('Berhasil menambah blok sensus!');
        setIsAddDialogOpen(false);
      } else {
        toast.error(response.data.message || 'Terjadi kesalahan.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Gagal menambahkan blok sensus.');
    }
  };

  const handleEditBlok = (item: BlokSensus) => {
    setEditBlok(item);
    setIsEditDialogOpen(true);
  };

  const handleConfirmUpdateBlok = async (id: number, formData: Partial<BlokSensus>) => {
    try {
      const response = await axios.post(`/dashboard/admin/segmen-blok-sensus/blok-sensus/update/${id}`, formData);
      if (response.data.status === 'success') {
        setBlokData((prev) => prev.map((b) => (b.id === id ? { ...b, ...formData } : b)));
        toast.success('Berhasil memperbarui blok sensus!');
        setIsEditDialogOpen(false);
      } else {
        toast.error(response.data.message || 'Terjadi kesalahan.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Gagal memperbarui blok sensus.');
    }
  };

  const handleDeleteBlok = (id: number) => {
    const item = blokData.find((b) => b.id === id);
    setDeleteData({ id, nomor: item?.nomor_bs });
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDeleteBlok = async (id: number) => {
    try {
      const response = await axios.delete(`/dashboard/admin/segmen-blok-sensus/blok-sensus/delete/${id}`);
      if (response.data.status === 'success') {
        setBlokData((prev) => prev.filter((b) => b.id !== id));
        toast.success('Berhasil menghapus blok sensus!');
        setIsDeleteDialogOpen(false);
      } else {
        toast.error(response.data.message || 'Terjadi kesalahan.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Gagal menghapus blok sensus.');
    }
  };

  // Kolom Tabel
  const blokColumns = [
    { accessorKey: 'nomor_bs', header: 'Nomor Blok Sensus' },
    {
      id: 'aksi',
      header: 'Aksi',
      cell: ({ row }: any) => {
        const rowData = row.original as BlokSensus;
        return (
          <div className="flex space-x-2">
            {canEditDelete ? (
              <>
                <Button variant="outline" size="sm" onClick={() => handleEditBlok(rowData)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteBlok(rowData.id)}>
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
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <Button variant="outline">Unduh</Button>
          <Button variant="outline">Unggah</Button>
          {canEditDelete && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <CirclePlus size={16} /> Tambah
            </Button>
          )}
        </div>
      </div>

      <DataTable 
        data={blokData} 
        columns={blokColumns} 
        name="blokSensus" 
        columnTitleMap={{ nomor_bs: 'Nomor Blok Sensus', aksi: 'Aksi' }} 
      />

      {/* Dialog Tambah */}
      <AddBlokSensusDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleAddBlok}
      />

      {/* Dialog Edit */}
      {editBlok && (
        <EditBlokSensusDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
            data={editBlok}
          onSave={(formData) => handleConfirmUpdateBlok(editBlok.id, formData)}
        />
      )}

      {/* Dialog Hapus */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader className="flex flex-col items-center">
            <AlertDialogTitle className="text-center">
              Hapus blok sensus {deleteData?.nomor}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteData && handleConfirmDeleteBlok(deleteData.id)}
            >
              Lanjutkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BlokSensusSection;
