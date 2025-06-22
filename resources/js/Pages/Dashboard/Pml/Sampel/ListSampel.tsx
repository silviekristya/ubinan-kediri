import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { DataTable } from "@/Components/Dashboard/Components/DataTable/DataTable";
import { Card, CardContent, CardHeader } from '@/Components/ui/card';
import { toast } from 'react-toastify';
import { Button } from '@/Components/ui/button';
import { generateColumns } from "@/Components/Dashboard/Components/DataTable/Components/Columns";
import { PageProps, Sampel } from '@/types';
import { CirclePlus } from 'lucide-react';

interface SampelPageProps extends PageProps {
  sampel: Sampel[];
}

const columnTitleMap: { [key: string]: string } = {
  jenis_sampel: "Jenis Sampel",
  jenis_tanaman: "Jenis Tanaman",
  jenis_komoditas: "Jenis Komoditas",
  frame_ksa: "Frame KSA",
  nama_prov: "Nama Provinsi",
  nama_kab_kota: "Nama Kabupaten",
  nama_kec: "Nama Kecamatan",
  nama_lok: "Nama Lokasi",
  segmen_id: "ID Segmen",
  subsegmen: "Subsegmen",
  nama_krt: "Nama KRT",
  strata: "Strata",
  bulan_listing: "Bulan Listing",
  tahun_listing: "Tahun Listing",
  fase_tanam: "Fase Tanam",
  rilis: "Tanggal Rilis",
  a_random: "Angka Random",
  nks: "NKS",
  long: "Longitude",
  lat: "Latitude",
  subround: "Subround",
  perkiraan_minggu_panen: "Perkiraan Minggu Panen",
  // Kolom untuk menampilkan Nama PML
  pcl_id: "Nama PCL",
};

// Custom render untuk kolom "tim_id" agar menampilkan nama PML
const customRender = (columnKey: string, row: Sampel) => {
  if (columnKey === 'pcl_id') {
    return row.pcl && row.pcl.nama ? row.pcl.nama : "Tidak ada PCL"
  }
  return undefined;
};

const SampelPage: React.FC = () => {
  const { auth, sampel } = usePage<SampelPageProps & { auth: any }>().props;
  
  // Cek role PML: misalnya, jika properti 'is_pml' ada dan bernilai true
  const userRole = auth.user.pegawai && auth.user.pegawai.is_pml ? 'PML' : auth.user.pegawai.role ??'';

  const [data, setData] = useState<Sampel[]>(sampel);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    setData(sampel);
  }, [sampel]);

  // Fungsi untuk menyalin data baris ke clipboard
  const handleCopy = (rowData: any) => {

    // Pastikan kita sedang di client side
    if (typeof window === "undefined") {
        toast.error("Clipboard tidak tersedia di sisi server.");
        return;
    }

    // Pastikan Clipboard API tersedia
    if (!navigator.clipboard) {
        toast.error("Clipboard API tidak tersedia di browser Anda.");
        return;
    }

    const { id, created_at, updated_at, ...dataWithoutId } = rowData;
    toast.promise(
      () => navigator.clipboard.writeText(JSON.stringify(dataWithoutId)),
      {
        pending: "Menyalin data ke clipboard...",
        success: "Data berhasil disalin ke clipboard",
        error: {
          render: (err) => `Gagal menyalin data ke clipboard: ${err?.data || err}`,
        },
      }
    );
  };

  // Generate kolom dengan mengoper onCopy, dan onEdit serta onDelete tidak dioper (undefined)
  const columns = generateColumns<Sampel>({
    name: "sampelPml",   
    columnTitleMap : columnTitleMap,
    customRender: customRender,
  });

  // console.log("Kolom yang dihasilkan:", columns);

  return (
    <DashboardLayout>
      <Head title="Sampel" />
      <Card className="w-full shadow-md overflow-x-auto">
        <CardHeader className="flex flex-col items-center text-base sm:text-xl font-semibold justify-between">
          <h2>Daftar Sampel PML</h2>
          {/* Contoh: Jika PML juga diizinkan tambah sampel, tombol tambah bisa ditampilkan */}
          {userRole === 'ADMIN' && (
            <Button
              className="gap-1 flex items-center justify-center"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <CirclePlus className="h-4 w-4" />
              Tambah Sampel
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <DataTable
            data={data}
            columns={columns}
            columnTitleMap={columnTitleMap}
            name="Sampel"
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default SampelPage;
