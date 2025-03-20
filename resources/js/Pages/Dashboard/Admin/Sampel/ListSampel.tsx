import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { DataTable } from "@/Components/Dashboard/Components/DataTable/DataTable";
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader } from '@/Components/ui/card';
import { toast } from 'react-toastify';
import axios from 'axios';
import { CirclePlus, TriangleAlert } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/Components/ui/alert-dialog";
import { AddSampelDialog } from '@/Components/Dashboard/Components/Admin/Sampel/AddSampelDialog';
import { EditSampelDialog } from '@/Components/Dashboard/Components/Admin/Sampel/EditSampelDialog';
import { generateColumns } from "@/Components/Dashboard/Components/DataTable/Components/Columns";
import { PageProps, Sampel, WithCsrf } from '@/types';

/**
 * Interface untuk data tambah/edit sampel (sesuai AddSampelDialog dan EditSampelDialog).
 * Anda bisa menyesuaikan union type enum (Utama/Cadangan, Padi/Palawija) dengan database.
 */
interface SampelFormData extends WithCsrf {
  jenis_sampel: "Utama" | "Cadangan";
  jenis_tanaman: "Padi" | "Palawija";
  frame_ksa?: string;
  prov: string;
  kab: string;
  kec: string;
  nama_prov: string;
  nama_kab: string;
  nama_kec: string;
  nama_lok: string;
  segmen_id?: string;
  subsegmen: string;
  strata: string;
  bulan_listing: string;
  tahun_listing: string;
  fase_tanam?: string;
  rilis?: string;
  a_random?: string;
  nks: string;
  long: string;
  lat: string;
  subround: string;
  // pcl_id?: number;
  // tim_id?: number;
}

interface SampelPageProps extends PageProps {
  sampel: Sampel[];
}

const columnTitleMap: { [key: string]: string } = {
  jenis_sampel: "Jenis Sampel",
  jenis_tanaman: "Jenis Tanaman",
  frame_ksa: "Frame KSA",
  prov: "Kode Provinsi",
  kab: "Kode Kabupaten",
  kec: "Kode Kecamatan",
  nama_prov: "Nama Provinsi",
  nama_kab: "Nama Kabupaten",
  nama_kec: "Nama Kecamatan",
  nama_lok: "Nama Lokasi",
  segmen_id: "ID Segmen",
  subsegmen: "Subsegmen",
  strata: "Strata",
  bulan_listing: "Bulan Listing",
  tahun_listing: "Tahun Listing",
  fase_tanam: "Fase Tanam",
  rilis: "Tanggal Rilis",
  a_random: "A Random",
  nks: "NKS",
  long: "Longitude",
  lat: "Latitude",
  subround: "Subround",
  // Jika ingin menampilkan pcl_id / tim_id, tambahkan di sini:
  // pcl_id: "ID PCL",
  // tim_id: "ID Tim",
};

const SampelPage = () => {
  const { sampel } = usePage<SampelPageProps>().props;

  // State data utama
  const [data, setData] = useState<Sampel[]>(sampel);

  // State untuk Edit Dialog
  const [editData, setEditData] = useState<Sampel | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // State untuk Hapus Dialog
  const [deleteData, setDeleteData] = useState<{ id: string; nama?: string } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // State untuk Tambah Dialog
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Flatten data jika perlu menambahkan field relasi
  useEffect(() => {
    const flattenedData = sampel.map((item) => ({
      ...item,
      // contoh: item.segmen ? item.segmen.nama_segmen : '-'
    }));
    setData(flattenedData);
  }, [sampel]);

  // Tambah Sampel
  const handleAddSampel = async (formData: SampelFormData) => {
    try {
      const response = await axios.post("/dashboard/admin/sampel/store", formData);
      if (response.data.status === "success") {
        setData((prevData) => [...prevData, response.data.sampel]);
        toast.success(response.data.message);
        setIsAddDialogOpen(false);
      } else {
        toast.error(response.data.message || "Terjadi kesalahan.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Gagal menambahkan sampel.");
    }
  };

  // Buka dialog edit
  const handleEdit = (id: string, sampelData: Sampel) => {
    setEditData(sampelData);
    setIsEditDialogOpen(true);
  };

  // Buka dialog hapus
  const handleDelete = (id: string) => {
    const sampelItem = data.find((item) => item.id === Number(id));
    setDeleteData({ id, nama: sampelItem?.nama_lok });
    setIsDeleteDialogOpen(true);
  };

  // Update Sampel
  const handleConfirmUpdate = async (id: number, formData: Partial<Sampel>) => {
    try {
      const response = await axios.post(`/dashboard/admin/sampel/update/${id}`, formData);
      if (response.data.status === 'success') {
        setData((prevData) =>
          prevData.map((item) => (item.id === id ? { ...item, ...formData } : item))
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
        toast.error('Gagal memperbarui sampel.');
      }
    }
  };

  // Konfirmasi Hapus Sampel
  const handleDeleteConfirm = async (id: string) => {
    try {
      const response = await axios.delete(`/dashboard/admin/sampel/delete/${id}`);
      if (response.data.status === 'success') {
        setData((prevData) => prevData.filter((item) => item.id !== Number(id)));
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
        toast.error('Gagal menghapus sampel.');
      }
    }
  };

  // Copy data ke Clipboard
  const handleCopy = (rowData: any) => {
    const { id, created_at, updated_at, ...dataWithoutId } = rowData;
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

  // Generate kolom tabel
  const columns = generateColumns<Sampel>(
    'sampel',
    columnTitleMap,
    undefined,
    undefined,
    handleEdit,
    handleCopy,
    handleDelete
  );

  return (
    <DashboardLayout>
      <Head title="Sampel" />
      <Card className="w-full shadow-md overflow-x-auto">
        <CardHeader className="flex flex-col items-center text-base sm:text-xl font-semibold justify-between">
          <h2>Daftar Sampel</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-end">
            <Button
              className="gap-1 flex items-center justify-center"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <CirclePlus className="h-4 w-4" />
              Tambah Sampel
            </Button>
          </div>
          <DataTable
            data={data}
            columns={columns}
            columnTitleMap={columnTitleMap}
            name="Sampel"
          />
        </CardContent>
      </Card>

      {/* Dialog Tambah Sampel */}
      <AddSampelDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleAddSampel}
      />

      {/* Dialog Edit Sampel */}
      {editData && (
        <EditSampelDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          // Di sini kita definisikan tipenya agar tidak 'any'
          onSave={(formData: Partial<Sampel>) => handleConfirmUpdate(editData.id, formData)}
          data={editData}
        />
      )}

      {/* Dialog Konfirmasi Hapus */}
      {isDeleteDialogOpen && deleteData && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader className="flex flex-col items-center">
              <AlertDialogTitle className="text-center">
                Anda yakin ingin menghapus Sampel {deleteData.nama}?
              </AlertDialogTitle>
              <div>
                <TriangleAlert className="h-32 w-32 text-red-500" />
              </div>
              <AlertDialogDescription>
                Tindakan ini tidak dapat dibatalkan. Ini akan menghapus Sampel {deleteData.nama} secara permanen.
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
    </DashboardLayout>
  );
};

export default SampelPage;
