import React, { useState } from 'react';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { DataTable } from '@/Components/Dashboard/Components/DataTable/DataTable';
import { CirclePlus } from 'lucide-react';
import { Sls } from '@/types';
import { AddSlsDialog } from '@/Components/Dashboard/Components/Admin/Sls/AddSlsDialog';
import { EditSlsDialog } from '@/Components/Dashboard/Components/Admin/Sls/EditSlsDialog';
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

const columnTitleMap: { [key: string]: string } = {
  nama_sls: 'Nama SLS',
  bs_id: 'Kode Blok Sensus',
};

interface NamaSlsSectionProps {
  slsData: Sls[];
  setSlsData: React.Dispatch<React.SetStateAction<Sls[]>>;
  canEditDelete: boolean; // Boleh edit/hapus?
}

const NamaSlsSection: React.FC<NamaSlsSectionProps> = ({
  slsData,
  setSlsData,
  canEditDelete,
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filteredBlokSensus, setFilteredBlokSensus] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editSls, setEditSls] = useState<Sls | null>(null);

  const [deleteData, setDeleteData] = useState<{ id: string; nama?: string } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // CRUD
  const handleAddSls = async (formData: any) => {
    try {
      const response = await axios.post('/dashboard/admin/segmen-blok-sensus/nama-sls/store', formData);
      if (response.data.status === 'success') {
        // setSlsData((prev) => [...prev, response.data.newNamaSls]);
        const newSls = response.data.newNamaSls;
        if (!newSls.nomor_bs) {
          console.warn("nomor_bs tidak tersedia pada response:", newSls);
        }
        setSlsData((prev) => [...prev, newSls]);
        toast.success('Berhasil menambah nama SLS!');
        setIsAddDialogOpen(false);
      } else {
        toast.error(response.data.message || 'Terjadi kesalahan.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Gagal menambahkan nama SLS. ' + (error as any)?.response?.data?.message);
    }
  };

  const handleEditSls = (id: string, item: Sls) => {
    setEditSls(item);
    setIsEditDialogOpen(true);
  };

  const handleConfirmUpdateSls = async (id: string, formData: Partial<Sls>) => {
    try {
      const response = await axios.post(`/dashboard/admin/segmen-blok-sensus/nama-sls/update/${id}`, formData);
      if (response.data.status === 'success') {
        const updatedSls = response.data.updatedNamaSls;
  
        setSlsData((prev) => prev.map((s) =>
          s.id_sls === id.toString() ? { ...s, ...updatedSls } : s
        ));
        toast.success('Berhasil memperbarui nama SLS!');
        setIsEditDialogOpen(false);
      } else {
        toast.error(response.data.message || 'Terjadi kesalahan.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Gagal memperbarui nama SLS.');
    }
  };

  const handleDeleteSls = (id: string) => {
    const item = slsData.find((s) => s.id_sls === id);
    setDeleteData({ id, nama: item?.nama_sls });
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDeleteSls = async (id: string) => {
    try {
      const response = await axios.delete(`/dashboard/admin/segmen-blok-sensus/nama-sls/delete/${id}`);
      if (response.data.status === 'success') {
        setSlsData((prev) => prev.filter((s) => s.id_sls !== id.toString()));
        toast.success('Berhasil menghapus nama SLS!');
        setIsDeleteDialogOpen(false);
      } else {
        toast.error(response.data.message || 'Terjadi kesalahan.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Gagal menghapus nama SLS.');
    }
  };

  async function fetchBlokSensus() {
    try {
      const { data } = await axios.get('/dashboard/admin/option/bs-available-list');
      setFilteredBlokSensus(data.blok_sensus);
    } catch (error) {
      console.error('Error fetching blok sensus:', error);
    }
  }

  async function handleOpenAddDialog() {
    await fetchBlokSensus();
    setIsAddDialogOpen(true);
  }
  
  // Kolom Tabel
  const columns = generateColumns(
    'segmen',
    columnTitleMap,
    undefined,
    undefined,
    undefined,
    handleEditSls,
    undefined,
    handleDeleteSls,
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <Button variant="outline">Unduh</Button>
          <Button variant="outline">Unggah</Button>
          {canEditDelete && (
            <Button onClick={handleOpenAddDialog} className="gap-1 flex items-center">
               <CirclePlus className="h-4 w-4" />
               Tambah
            </Button>
          )}
        </div>
      </div>

      <DataTable 
        data={slsData} 
        columns={columns} 
        name="namaSLS" 
        columnTitleMap={{ nomor_bs: 'Nomor Blok Sensus', nama_sls: 'SLS', aksi: 'Aksi' }} 
      />

      {/* Dialog Tambah */}
      <AddSlsDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleAddSls}
      />

      {/* Dialog Edit */}
      {editSls && (
        <EditSlsDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          data={editSls}
          onSave={(formData) => handleConfirmUpdateSls(editSls.id_sls, formData)}
        />
      )}

      {/* Dialog Hapus */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader className="flex flex-col items-center">
            <AlertDialogTitle className="text-center">
              Hapus nama SLS {deleteData?.nama}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteData && handleConfirmDeleteSls(deleteData.id)}
            >
              Lanjutkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
export default NamaSlsSection;


