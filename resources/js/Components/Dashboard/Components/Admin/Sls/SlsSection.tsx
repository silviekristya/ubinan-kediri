import React, { useState, useEffect } from 'react';
import { Button } from '@/Components/ui/button';
import { DataTable } from '@/Components/Dashboard/Components/DataTable/DataTable';
import { CirclePlus } from 'lucide-react';
import { Sls } from '@/types';
import { AddSlsDialog } from '@/Components/Dashboard/Components/Admin/Sls/AddSlsDialog';
import { EditSlsDialog } from '@/Components/Dashboard/Components/Admin/Sls/EditSlsDialog';
import { TriangleAlert } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/Components/ui/alert-dialog'
import { toast } from 'react-toastify';
import axios from 'axios';
import { generateColumns } from '@/Components/Dashboard/Components/DataTable/Components/Columns';

// Type untuk opsi blok sensus
type BlokSensusOption = { id_bs: string; nomor_bs: string };

// Peta judul kolom sesuai field database
const columnTitleMap: Record<string,string> = {
  id: 'Kode SLS',
  nama_sls: 'Nama SLS',
  bs_id: 'Kode Blok Sensus',
};

interface NamaSlsSectionProps {
  slsData: Sls[];
  setSlsData: React.Dispatch<React.SetStateAction<Sls[]>>;
  canEditDelete: boolean;
}

const NamaSlsSection: React.FC<NamaSlsSectionProps> = ({ slsData, setSlsData, canEditDelete }) => {
  const [blokOptions, setBlokOptions] = useState<BlokSensusOption[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<Sls | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{ id: string; nama: string } | null>(null);

  // Ambil opsi blok sensus
  useEffect(() => {
    axios.get('/dashboard/admin/option/bs-available-list')
      .then(res => setBlokOptions(res.data.bs.map((b: any) => ({ id_bs: b.id, nomor_bs: b.id }))))
      .catch(e => console.error('Fetch blok sensus error:', e));
  }, []);

  // Tambah entri baru
  const handleAdd = async (form: { nama_sls: string; bs_id: string }) => {
    try {
      const { data } = await axios.post('/dashboard/admin/wilayah/sls/store', form);
      if (data.status === 'success') {
        setSlsData(prev => [
          ...prev,
          { id: data.newNamaSls.id.toString(), nama_sls: data.newNamaSls.nama_sls, bs_id: data.newNamaSls.bs_id.toString() }
        ]);
        toast.success('SLS berhasil ditambahkan');
        setIsAddOpen(false);
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      console.error('Add SLS error:', e);
      toast.error('Gagal menambah SLS');
    }
  };

  // Handler edit: id & data
  const handleEditOpen = (id: string, item: Sls) => {
    setEditItem(item);
    setIsEditOpen(true);
  };

  // Simpan perubahan edit
  const handleEditSave = async (form: Partial<Sls>) => {
    if (!editItem) return;
    try {
      const { data } = await axios.post(
        `/dashboard/admin/wilayah/sls/update/${editItem.id}`,
        form
      );
      if (data.status === 'success') {
        setSlsData(prev => prev.map(s =>
          s.id === editItem.id
            ? { ...s, ...data.updatedNamaSls, id: data.updatedNamaSls.id?.toString() || s.id }
            : s
        ));
        toast.success('SLS berhasil diperbarui');
        setIsEditOpen(false);
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      console.error('Update SLS error:', e);
      toast.error('Gagal memperbarui SLS');
    }
  };

  // Handler delete open: hanya terima id
  const handleDeleteOpen = (id: string) => {
    const item = slsData.find(s => s.id === id);
    if (!item) return;
    setDeleteItem({ id: item.id, nama: item.nama_sls });
    setIsDeleteOpen(true);
  };

  // Konfirmasi hapus
  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    try {
      const { data } = await axios.delete(
        `/dashboard/admin/wilayah/sls/delete/${deleteItem.id}`
      );
      if (data.status === 'success') {
        setSlsData(prev => prev.filter(s => s.id !== deleteItem.id));
        toast.success('SLS berhasil dihapus');
        setIsDeleteOpen(false);
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      console.error('Delete SLS error:', e);
      toast.error('Gagal menghapus SLS');
    }
  };

  // Definisi kolom DataTable
  const columns = generateColumns({
    name:'sls',
    columnTitleMap:columnTitleMap,
    onEdit:handleEditOpen,
    onDelete:handleDeleteOpen
  });

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button variant="outline">Unduh</Button>
          <Button variant="outline">Unggah</Button>
          {canEditDelete && (
            <Button onClick={() => setIsAddOpen(true)} className="flex items-center gap-1">
              <CirclePlus className="h-4 w-4" /> Tambah
            </Button>
          )}
        </div>
      </div>

      <DataTable
        data={slsData}
        columns={columns}
        name="sls"
        columnTitleMap={columnTitleMap}
      />

      <AddSlsDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        blokSensusOptions={blokOptions}
        onSave={handleAdd}
      />

      {editItem && (
        <EditSlsDialog
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          data={editItem}
          blokSensusOptions={blokOptions}
          onSave={handleEditSave}
        />
      )}

      { deleteItem && (
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent>
              <AlertDialogHeader className="flex flex-col items-center">
                  <AlertDialogTitle className="text-center">
                    Hapus SLS {deleteItem.nama}?
                  </AlertDialogTitle>
                  <div>
                    <TriangleAlert className="h-32 w-32 text-red-500" />
                  </div>
                  <AlertDialogDescription>
                    Tindakan ini tidak dapat dibatalkan. Ini akan menghapus SLS {deleteItem.nama} secara permanen.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="mr-2">Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteConfirm}>
                    Lanjutkan
                  </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
      </AlertDialog>)}
    </>
  );
};

export default NamaSlsSection;
