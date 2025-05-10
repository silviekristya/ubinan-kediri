import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { DataTable } from "@/Components/Dashboard/Components/DataTable/DataTable";
import type { DataTableColumnDef } from "@/Components/Dashboard/Components/DataTable/Components/Columns";
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader } from '@/Components/ui/card';
import { toast } from 'react-toastify';
import { AddImportDialog } from '@/Components/Dashboard/Components/Admin/Sampel/AddImportDialog';
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
import { PageProps, Sampel, Segmen, BlokSensus, NamaSls, Tim } from '@/types';
import { SampelFormData } from "@/Components/Dashboard/Components/Admin/Sampel/EditSampelDialog";
import AddAlokasiPmlDialog from '@/Components/Dashboard/Components/Admin/Alokasi/AddAlokasiPmlDialog';
import AddAlokasiPclDialog from '@/Components/Dashboard/Components/Admin/Alokasi/AddAlokasiPclDialog';

interface SampelPageProps extends PageProps {
  sampel: Sampel[];
}

interface FlatSampel extends Omit<Sampel, 'nama_sls' | 'nomor_bs'> {
  nama_sls: string;
  nomor_bs: string;
}

const columnTitleMap: { [key: string]: string } = {
  jenis_sampel: "Jenis Sampel",
  jenis_tanaman: "Jenis Tanaman",
  jenis_komoditas: "Jenis Komoditas",
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
  // Kolom nomor_bs dan nama_sls akan didapat melalui relasi:
  nomor_bs: "Nomor BS",
  nama_sls: "Nama SLS",
  nama_krt: "Nama KRT",
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
  perkiraan_minggu_panen: "Perkiraan Minggu Panen",
  tim_id: "PML Bertugas",
  pcl_id: "PCL Bertugas",
};

const SampelPage = () => {
  const { sampel } = usePage<SampelPageProps>().props;

  // State utama
  // const [data, setData] = useState<Sampel[]>(sampel);
  const [data, setData] = useState<FlatSampel[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editData, setEditData] = useState<Sampel | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteData, setDeleteData] = useState<{ id: string; nama?: string } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Opsi dropdown
  const [segmenOptions, setSegmenOptions] = useState<Segmen[]>([]);
  const [blokSensusOptions, setBlokSensusOptions] = useState<BlokSensus[]>([]);
  const [slsOptions, setSlsOptions] = useState<NamaSls[]>([]);

  const [isImportOpen, setIsImportOpen] = useState(false);

  // Fetch opsi dropdown
  const fetchSegmenOptions = async () => {
    try {
      const res = await axios.get("/dashboard/admin/option/segmen-available-list");
      setSegmenOptions(res.data.segmen || []);
    } catch (error) {
      console.error("Gagal mengambil data segmen", error);
    }
  };

  const fetchBlokSensusOptions = async () => {
    try {
      const res = await axios.get("/dashboard/admin/option/bs-available-list");
      setBlokSensusOptions(res.data.blok_sensus || []);
    } catch (error) {
      console.error("Gagal mengambil data blok sensus", error);
    }
  };

  // Jika diperlukan, fetch SLS options (meskipun untuk tampilan di dialog, biasanya diatur di dalam dialog)
  const fetchSlsOptions = async (nomor_bs?: string) => {
    try {
      const res = await axios.get("/dashboard/admin/option/sls-available-list", {
        params: { nomor_bs },
      });
      setSlsOptions(res.data.nama_sls || []);
    } catch (error) {
      console.error("Gagal mengambil data SLS", error);
    }
  };

  // fetch tim option
  const fetchTimOptions = async (): Promise<Tim[]> => {
    try {
      const res = await axios.get('/dashboard/admin/option/tim-available-list');
      return res.data.tim; // Pastikan struktur data sesuai dengan response backend
    } catch (error) {
      console.error('Gagal mengambil data tim', error);
      return [];
    }
  };

  useEffect(() => {
    // Lakukan flatten data jika perlu
    const flattenedData: FlatSampel[] = sampel.map(item => ({ 
      ...item,
      // Ambil data dari relasi yang diperlukan
      nama_sls:    item.nama_sls?.nama_sls ?? '-',
      nomor_bs:    item.nama_sls?.blok_sensus?.nomor_bs ?? '-',
    }));
    setData(flattenedData); // Cast ke tipe Sampel[]

    // Fetch opsi dropdown
    fetchSegmenOptions();
    fetchBlokSensusOptions();
    fetchSlsOptions();
    fetchTimOptions().then((timData) => {
      setTimOptions(timData);
    });
  }, [sampel]);

  // Tambah Sampel
  const handleAddSampel = async (formData: SampelFormData) => {
    try {
      const response = await axios.post("/dashboard/admin/sampel/store", formData);
      if (response.data.status === "success") {
        setData(prev => [...prev, response.data.sampel]);
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
    const sampelItem = data.find(item => item.id === Number(id));
    setDeleteData({ id, nama: sampelItem?.nama_lok });
    setIsDeleteDialogOpen(true);
  };

  // Update Sampel – perbaiki agar mengirim data FK SLS (id_sls)
  const handleConfirmUpdate = async (id: number, formData: SampelFormData) => {
    try {
      // Di sini, asumsikan formData sudah memiliki field id_sls (sebagai number)
      const response = await axios.post(`/dashboard/admin/sampel/update/${id}`, formData);
      if (response.data.status === "success") {
        setData(prev =>
          prev.map(item => (item.id === id ? { ...item, ...response.data.sampel } : item))
        );
        setIsEditDialogOpen(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || "Terjadi kesalahan.");
      }
    } catch (error: any) {
      if (error.response && error.response.data.errors) {
        const errorMessage = Object.values(error.response.data.errors)
          .flat()
          .join(", ");
        toast.error(`Gagal: ${errorMessage}`);
      } else {
        toast.error("Gagal memperbarui sampel.");
      }
    }
  };

  // Konfirmasi Hapus Sampel
  const handleDeleteConfirm = async (id: string) => {
    try {
      const response = await axios.delete(`/dashboard/admin/sampel/delete/${id}`);
      if (response.data.status === "success") {
        setData(prev => prev.filter(item => item.id !== Number(id)));
        setIsDeleteDialogOpen(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || "Terjadi kesalahan.");
      }
    } catch (error: any) {
      if (error.response && error.response.data.errors) {
        const errorMessage = Object.values(error.response.data.errors)
          .flat()
          .join(", ");
        toast.error(`Gagal: ${errorMessage}`);
      } else {
        toast.error("Gagal menghapus sampel.");
      }
    }
  };

  // Copy data ke clipboard
  const handleCopy = (rowData: any) => {
    const { id, created_at, updated_at, ...dataWithoutId } = rowData;
    toast.promise(
      () => navigator.clipboard.writeText(JSON.stringify(dataWithoutId)),
      {
        pending: "Menyalin data ke clipboard...",
        success: "Data berhasil disalin ke clipboard",
        error: {
          render: (err) => `Gagal menyalin data ke clipboard: ${err}`,
        },
      }
    );
  };

    // Custom render untuk kolom PML dan PCL
    const customRender = (columnKey: string, row: Sampel) => {
      try {
        if (columnKey === 'tim_id') {
          if (!row.tim_id) {
            return (
              <Button onClick={() => {
                console.log("Klik Alokasi PML untuk row:", row);
                setSelectedForPml(row);
              }}>
                Alokasi
              </Button>
            );
          } else {
            return (
              <span>
                {row.tim && row.tim.pml && row.tim.pml.nama 
                  ? row.tim.pml.nama 
                  : "Nama PML tidak tersedia"}
              </span>
            );
          }
        } else if (columnKey === 'pcl_id') {
          if (!row.pcl_id) {
            return (
              <Button onClick={() => {
                console.log("Klik Alokasi PCL untuk row:", row);
                setSelectedForPcl(row);
              }}>
                Alokasi
              </Button>
            );
          } else {
            // Misal, jika sampel sudah memiliki pcl_id, tampilkan nama PCL jika tersedia
            // Jika data sampel tidak mengembalikan relasi pcl, gunakan fallback
            return (
              <span>
                {row.pcl ? row.pcl.nama : "Nama PCL tidak tersedia"}
              </span>
            );
          }
        }
        return null;
      } catch (error) {
        console.error("Error dalam customRender untuk kolom", columnKey, "pada row:", row, error);
        return <span>Error rendering</span>;
      }
    };
  
  

  // State dan handler untuk dialog alokasi PML
  const [selectedForPml, setSelectedForPml] = useState<Sampel | null>(null);
  const [timOptions, setTimOptions] = useState<Tim[]>([]);
  const [selectedForPcl, setSelectedForPcl] = useState<Sampel | null>(null);

  // useEffect(() => {
  //   fetchTimOptions().then(setTimOptions);
  // }, []);

  const handlePmlAllocationSuccess = async (timId: number) => {
    if (!selectedForPml) return;
  
    try {
      // Panggil endpoint alokasi PML
      const response = await axios.put(`/dashboard/admin/alokasi/update/sampel/${selectedForPml.id}/pml`, {
        tim_id: timId,
      });
  
      // Respons berisi sampel yang sudah di-load dengan relasi tim -> pml
      const updatedSample = response.data.sampel;
      console.log("Updated sample:", updatedSample);
  
      // Perbarui state data di frontend
      setData(prev =>
        prev.map(item => (item.id === updatedSample.id ? updatedSample : item))
      );
  
      setSelectedForPml(null);
      toast.success("PML berhasil diperbarui.");
    } catch (error) {
      console.error("Error saat update PML:", error);
      toast.error("Gagal menyimpan PML");
    }
  };
  
  // Handler untuk update alokasi PCL
  const handlePclAllocationSuccess = async (pclId: number) => {
    if (!selectedForPcl) return;
    try {
      const response = await axios.put(`/dashboard/admin/alokasi/update/sampel/${selectedForPcl.id}/pcl`, {
        pcl_id: pclId,
      });
      const updatedSample = response.data.sampel;
      console.log("Updated sample (PCL):", updatedSample);
      setData(prev =>
        prev.map(item => (item.id === updatedSample.id ? updatedSample : item))
      );
      setSelectedForPcl(null);
      toast.success("PCL berhasil diperbarui.");
    } catch (error) {
      console.error("Error saat update PCL:", error);
      toast.error("Gagal menyimpan PCL");
    }
  };

  // Generate kolom tabel, tambahkan kolom untuk menampilkan relasi
  const columns = generateColumns<Sampel>(
    "sampel",
    columnTitleMap,
    customRender,
    undefined,
    undefined,
    handleEdit,
    handleCopy,
    handleDelete
  );

  // console.log("Kolom yang dihasilkan:", columns);
  return (
    <DashboardLayout>
      <Head title="Sampel" />
      {/* Tombol Import hanya di halaman Sampel */}
      <div className="mb-4">
        <Button onClick={() => setIsImportOpen(true)}>
          Import Excel
        </Button>
      </div>

      {/* Dialog untuk pilih & upload file Excel */}
      <AddImportDialog
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      />
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
              {/* Tambah Sampel */}
            </Button>
          </div>
          <DataTable
            data={data}
            columns={columns as DataTableColumnDef<FlatSampel>[]}
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
        segmenOptions={segmenOptions}
        blokSensusOptions={blokSensusOptions}
        // slsOptions tidak dikirim karena dialog akan fetch sendiri
      />

      {/* Dialog Edit Sampel */}
      {editData && (
        <EditSampelDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={(formData: SampelFormData) => handleConfirmUpdate(editData.id, formData)}
          data={editData}
          segmenOptions={segmenOptions}
          blokSensusOptions={blokSensusOptions}
          // slsOptions tidak dikirim karena dialog akan fetch sendiri
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
      {/* Dialog Alokasi PML */}
      {selectedForPml && (
        <AddAlokasiPmlDialog
          isOpen={!!selectedForPml}
          sampel={selectedForPml}
          onClose={() => setSelectedForPml(null)}
          onAllocationSuccess={handlePmlAllocationSuccess}
          tim={timOptions} // Pass tim options ke dialog
        />
      )}

      {/* Dialog Alokasi PCL */}
      {selectedForPcl && (
        <AddAlokasiPclDialog
          isOpen={!!selectedForPcl}
          sampel={selectedForPcl}
          onClose={() => setSelectedForPcl(null)}
          onAllocationSuccess={handlePclAllocationSuccess}
        />
      )}
    </DashboardLayout>
  );
};

export default SampelPage;
