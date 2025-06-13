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

// Tipe untuk mapping API bs
interface BlokSensusOption {
  id_bs: string;
  nomor_bs: string;
}

const columnTitleMap: Record<string, string> = {
  nama_sls: 'Nama SLS',
  bs_id: 'Kode Blok Sensus',
};

interface NamaSlsSectionProps {
  slsData: Sls[];
  setSlsData: React.Dispatch<React.SetStateAction<Sls[]>>;
  canEditDelete: boolean;
}

const NamaSlsSection: React.FC<NamaSlsSectionProps> = ({
  slsData,
  setSlsData,
  canEditDelete,
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filteredBlokSensus, setFilteredBlokSensus] = useState<BlokSensusOption[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editSls, setEditSls] = useState<Sls | null>(null);
  const [deleteData, setDeleteData] = useState<{ id: string; nama?: string } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch daftar blok sensus untuk dropdown
  async function fetchBlokSensus() {
    try {
      const response = await axios.get('/dashboard/admin/option/bs-available-list');
      // API returns { bs: [ { id, text }, … ] }
      const raw: { id: string; text: string }[] = response.data.bs;
      const options = raw.map(item => ({
        id_bs:      item.id,    // sesuai field di BlokSensusOption
        nomor_bs:   item.text,  // ini yang nanti ditampilkan jika perlu
      }));
      setFilteredBlokSensus(options);
    } catch (error) {
      console.error('Error fetching blok sensus:', error);
    }
  }

  const handleOpenAddDialog = async () => {
    await fetchBlokSensus();
    setIsAddDialogOpen(true);
  };

  // Tambah SLS
  const handleAddSls = async (formData: { nama_sls: string; bs_id: string }) => {
    try {
      const { data } = await axios.post(
        '/dashboard/admin/wilayah/nama-sls/store',
        formData
      );
      if (data.status === 'success') {
        const rawSls = data.newNamaSls;
        const formatted: Sls = {
          id_sls: rawSls.id.toString(),
          nama_sls: rawSls.nama_sls,
          bs_id: rawSls.bs_id.toString(),
          // nomor_bs: rawSls.nomor_bs,
        };
        setSlsData((prev) => [...prev, formatted]);
        toast.success(data.message || 'SLS berhasil ditambahkan.');
        setIsAddDialogOpen(false);
      } else {
        toast.error(data.message || 'Terjadi kesalahan.');
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Gagal menambah nama SLS. ' + err.response?.data?.message);
    }
  };

  // Edit SLS
  const handleEditSls = (id: string, item: Sls) => {
    setEditSls(item);
    setIsEditDialogOpen(true);
  };

  const handleConfirmUpdateSls = async (id: string, formData: Partial<Sls>) => {
    try {
      const { data } = await axios.post(
        `/dashboard/admin/wilayah/nama-sls/update/${id}`,
        formData
      );
      if (data.status === 'success') {
        const upd = data.updatedNamaSls;
        setSlsData((prev) =>
          prev.map((s) => (s.id_sls === id ? { ...s, ...upd } : s))
        );
        toast.success('Berhasil memperbarui nama SLS!');
        setIsEditDialogOpen(false);
      } else {
        toast.error(data.message || 'Terjadi kesalahan.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal memperbarui nama SLS.');
    }
  };

  // Hapus SLS
  const handleDeleteSls = (id: string) => {
    const item = slsData.find((s) => s.id_sls === id);
    setDeleteData({ id, nama: item?.nama_sls });
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDeleteSls = async (id: string) => {
    try {
      const { data } = await axios.delete(
        `/dashboard/admin/wilayah/nama-sls/delete/${id}`
      );
      if (data.status === 'success') {
        setSlsData((prev) => prev.filter((s) => s.id_sls !== id));
        toast.success('Berhasil menghapus nama SLS!');
        setIsDeleteDialogOpen(false);
      } else {
        toast.error(data.message || 'Terjadi kesalahan.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal menghapus nama SLS.');
    }
  };

  const columns = generateColumns(
    'segmen',
    columnTitleMap,
    undefined,
    undefined,
    undefined,
    handleEditSls,
    undefined,
    handleDeleteSls
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

      <AddSlsDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        blokSensusOptions={filteredBlokSensus}
        onSave={handleAddSls}
      />

      {editSls && (
        <EditSlsDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          data={editSls}
          onSave={(formData) => handleConfirmUpdateSls(editSls.id_sls, formData)}
        />
      )}

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
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </AlertDialogCancel>
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
