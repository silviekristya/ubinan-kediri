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
  nama_kab: "Nama Kabupaten",
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
  tim_id: "Nama PML",
};

// Custom render untuk kolom "tim_id" agar menampilkan nama PML
const customRender = (columnKey: string, row: Sampel) => {
  if (columnKey === 'tim_id') {
    return row.tim && row.tim.pml ? row.tim.pml.nama : "Tidak ada PML";
  }
  return undefined;
};

const SampelPage: React.FC = () => {
  const { auth, sampel } = usePage<SampelPageProps & { auth: any }>().props;
  // Role: MITRA jika objek mitra ada, selain itu gunakan role dari pegawai
  const userRole = auth.user.mitra ? 'MITRA' : auth.user.pegawai?.role ?? '';
  
  const [data, setData] = useState<Sampel[]>(sampel);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    setData(sampel);
  }, [sampel]);

  // Fungsi untuk menyalin data baris ke clipboard
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

  // Generate kolom dengan mengoper onCopy, dan mengoper onEdit serta onDelete sebagai undefined
  const columns = generateColumns<Sampel>(
    "sampelMitra",           // Prefix atau nama context kolom
    columnTitleMap,
    customRender,       // Custom render untuk kolom "tim_id"
    undefined,          // onDetail
    undefined,          // onUpdateStatus
    undefined,          // onEdit 
    handleCopy,         // onCopy
    undefined           // onDelete 
  );

  // console.log("Kolom yang dihasilkan:", columns);

  return (
    <DashboardLayout>
      <Head title="Sampel" />
      <Card className="w-full shadow-md overflow-x-auto">
        <CardHeader className="flex flex-col items-center text-base sm:text-xl font-semibold justify-between">
          <h2>Daftar Sampel Mitra</h2>
          {/* Tombol tambah hanya muncul untuk ADMIN */}
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
