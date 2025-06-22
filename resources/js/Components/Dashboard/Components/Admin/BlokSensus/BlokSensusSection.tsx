import React, { useState, useEffect, FormEventHandler } from 'react';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { DataTable } from '@/Components/Dashboard/Components/DataTable/DataTable';
import { CirclePlus, TriangleAlert } from 'lucide-react';
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
import { generateColumns } from '@/Components/Dashboard/Components/DataTable/Components/Columns';

interface BlokSensusSectionProps {
  blokData: BlokSensus[];
  setBlokData: React.Dispatch<React.SetStateAction<BlokSensus[]>>;
  canEditDelete: boolean; // Boleh edit/hapus?
}

const columnTitleMap: { [key: string]: string } = {
  id_bs: 'Kode Blok Sensus',
  nomor_bs: 'No Blok Sensus',
  nama_kel_desa: 'Kel/Desa',
};

const BlokSensusSection: React.FC<BlokSensusSectionProps> = ({
  blokData,
  setBlokData,
  canEditDelete,
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editBlok, setEditBlok] = useState<BlokSensus | null>(null);
  const [deleteData, setDeleteData] = useState<{ id: string; nomor?: string } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // CRUD
  const handleAddBlok = async (formData: any) => {
    try {
      const response = await axios.post(
        '/dashboard/admin/wilayah/blok-sensus/store',
        formData
      );

      if (response.data.status === 'success') {
        const newBlk: BlokSensus = response.data.data;
        const newKelDesa = response.data.data.kel_desa;
        // alias id_bs ke id
        setBlokData((prev) => [
          ...prev,
          { ...newBlk,
            id: newBlk.id_bs,
            nama_kel_desa: newKelDesa.nama_kel_desa,
            kel_desa_id: newBlk.kel_desa_id,
            nomor_bs: newBlk.nomor_bs,
          },
        ]);

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

  const handleEditBlok = (id: string, item: BlokSensus) => {
    setEditBlok(item);
    setIsEditDialogOpen(true);
  };

  const handleConfirmUpdateBlok = async (id: string, formData: Partial<BlokSensus>) => {
    try {
      const response = await axios.post(`/dashboard/admin/wilayah/blok-sensus/update/${id}`, formData);
      if (response.data.status === 'success') {
        const newBlk: BlokSensus = response.data.data;
        const newKelDesa = response.data.data.kel_desa;
        setBlokData(prev =>
          prev.map(b =>
            b.id_bs === id
              ? {
                  id_bs: newBlk.id_bs,
                  nomor_bs: newBlk.nomor_bs,
                  kel_desa_id: newBlk.kel_desa_id,
                  nama_kel_desa: newKelDesa.nama_kel_desa,
                  id: response.data.data.id_bs,
                }
              : b
          )
        );
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

  const handleDeleteBlok = (id: string) => {
    const item = blokData.find((b) => b.id_bs === id.toString());
    setDeleteData({ id, nomor: item?.nomor_bs });
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDeleteBlok = async (id: string) => {
    try {
      const response = await axios.delete(`/dashboard/admin/wilayah/blok-sensus/delete/${id}`);
      if (response.data.status === 'success') {
        setBlokData((prev) => prev.filter((b) => b.id_bs !== id.toString()));
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
  const columns = generateColumns({
    name:'blokSensus',
    columnTitleMap:columnTitleMap,
    onEdit:handleEditBlok,
    onDelete:handleDeleteBlok,
  });


  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <Button variant="outline">Unduh</Button>
          <Button variant="outline">Unggah</Button>
          {canEditDelete && (
            <Button className="gap-1 flex items-center justify-center" onClick={() => setIsAddDialogOpen(true)}>
              <CirclePlus className="h-4 w-4" /> Tambah
            </Button>
          )}
        </div>
      </div>

      <DataTable
        data={blokData.map(b => ({ ...b, id: b.id_bs, nama_kel_desa: b.nama_kel_desa }))}
        columns={columns}
        name="blokSensus"
        columnTitleMap={columnTitleMap}
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
          onSave={(formData) => handleConfirmUpdateBlok(editBlok.id_bs, formData)}
        />
      )}

      {/* Dialog Hapus */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader className="flex flex-col items-center">
            <AlertDialogTitle className="text-center">
              Hapus blok sensus {deleteData?.nomor}?
            </AlertDialogTitle>
            <div>
                <TriangleAlert className="h-32 w-32 text-red-500" />
            </div>
            <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus blok sensus {deleteData?.id} secara permanen.
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
