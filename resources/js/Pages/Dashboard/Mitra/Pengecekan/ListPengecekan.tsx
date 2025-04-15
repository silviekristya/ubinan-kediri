// resources/js/Pages/Dashboard/Mitra/Pengecekan/Index.tsx

import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { DataTable } from '@/Components/Dashboard/Components/DataTable/DataTable';
import { Card, CardHeader, CardContent } from '@/Components/ui/card';
import { toast } from 'react-toastify';
import { generateColumns } from '@/Components/Dashboard/Components/DataTable/Components/Columns';
import { PageProps, Sampel } from '@/types';
import { AddPengecekanDialog } from '@/Components/Dashboard/Components/Mitra/Pengecekan/AddPengecekanDialog';
import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/Components/ui/button';


interface PengecekanPageProps extends PageProps {
  mainSamples: Sampel[];
  backupSamples: Sampel[];
}

const columnTitleMap: Record<string, string> = {
  id: 'ID',
  jenis_tanaman: 'Jenis Tanaman',
  tahun_listing: 'Tahun Listing',
  subround: 'Subround',
  nama_kec: 'Nama Kecamatan',
  nama_lok: 'Nama Lokasi',
  segmen_id: 'ID Segmen',
  nama_krt: 'Nama KRT',
  rilis: 'Rilis',
  nks: 'NKS',
  tanggal_pengecekan: 'Tanggal Pengecekan',
  nama_responden: 'Responden',
  no_telepon_responden: 'No. Telepon',
  tanggal_panen: 'Tanggal Panen',
  keterangan: 'Keterangan',
  status_sampel: 'Status Sampel',
};

const PengecekanPage: React.FC = () => {
  const { auth, mainSamples, backupSamples } = usePage<
    PengecekanPageProps & { auth: any }
  >().props;

  const [mainData, setMainData] = useState<Sampel[]>(mainSamples);
  const [backupData, setBackupData] = useState<Sampel[]>(backupSamples);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogSamples, setDialogSamples] = useState<Sampel[]>([]);

  useEffect(() => {
    setMainData(mainSamples);
  }, [mainSamples]);

  useEffect(() => {
    setBackupData(backupSamples);
  }, [backupSamples]);

  // const handleEdit = (id: string, data: any) => {
  //   setDialogSamples([data as Sampel]);
  //   setIsDialogOpen(true);
  // };

  // Fungsi untuk membuka dialog "tambah pengecekan"
  const openAddDialog = (row: Sampel) => {
    setDialogSamples([row]);
    setIsDialogOpen(true);
  };


  const customRender = (col: string, row: Sampel) => {
    const p = row.pengecekan;
    switch (col) {
      case 'tanggal_pengecekan':   return p?.tanggal_pengecekan ?? '-';
      case 'nama_responden':       return p?.nama_responden     ?? '-';
      case 'no_telepon_responden': return p?.no_telepon_responden ?? '-';
      case 'tanggal_panen':        return p?.tanggal_panen      ?? '-';
      case 'keterangan':         return p?.keterangan          ?? '-';
      case 'status_sampel':       return p?.status_sampel      ?? 'Belum';
      default: return undefined;
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setDialogSamples([]);
  };

  // const handleSave = (formData: any): Promise<void> => {
  //   return new Promise((resolve, reject) => {
  //     Inertia.post(route('dashboard.mitra.pengecekan.store'), formData, {
  //       onSuccess: () => {
  //         toast.success('Data pengecekan tersimpan');
  //         closeDialog();
  //         resolve();
  //       },
  //       onError: () => {
  //         toast.error('Gagal menyimpan pengecekan');
  //         reject();
  //       },
  //     });
  //   });
  // };

  const handleAddPengecekan = async (formData: any) => {
    try {
      console.log("Mengirim data pengecekan:", formData);
  
      const response = await axios.post(
        '/dashboard/mitra/pengecekan/store',
        formData,
        { headers: { Accept: 'application/json' } }
      );
      console.log("Response:", response.data);
  
      if (response.data.status === 'success') {
        toast.success(response.data.message);
        setIsDialogOpen(false);
  
        // Jika kamu ingin otomatis refresh daftar:
        // Inertia.reload();
  
        // Atau, jika kamu punya endpoint API untuk fetch ulang:
        // await fetchSamples();
      } else {
        toast.error(response.data.message || 'Terjadi kesalahan.');
      }
    } catch (error: any) {
      console.error(error);
      toast.error('Gagal menambahkan pengecekan.');
      throw error;
    }
  };
  


  // generateColumns: name, titleMap, customRender?, onDetail, onUpdateStatus, onEdit, onCopy, onDelete
  const baseColumnsMain = generateColumns<Sampel>(
    'pengecekanUtama',
    columnTitleMap,
    customRender,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
  );

  // Tambahkan kolom aksi terakhir dengan tombol pengecekan
  const actionColumn: ColumnDef<Sampel> = {
    id: 'action',
    header: 'Aksi',
    cell: ({ row }) => {
      const hasChecked = Boolean(row.original.pengecekan);
      return (
        <Button
          size="sm"
          variant={hasChecked ? 'outline' : 'default'}
          onClick={() => {
            if (!hasChecked) openAddDialog(row.original);
          }}
          disabled={hasChecked}
        >
          Tambah Pengecekan
        </Button>
      );
    },
    enableSorting: false,
    enableColumnFilter: false,
  };
  
  // gabungkan jadi columnsMain
  const columnsMain: ColumnDef<Sampel>[] = [
    ...baseColumnsMain,
    actionColumn,
  ];

  const columnsBackup = generateColumns<Sampel>(
    'pengecekanCadangan',
    columnTitleMap,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
  );

  return (
    <DashboardLayout>
      <Head title="Pengecekan Sampel" />

      {/* Sampel Utama */}
      <Card className="mb-6">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Sampel Utama</h2>
        </CardHeader>
        <CardContent>
          <DataTable
            data={mainData}
            columns={columnsMain}
            columnTitleMap={columnTitleMap}
            name="Sampel Utama"
          />
        </CardContent>
      </Card>

      {/* Sampel Cadangan */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Sampel Cadangan</h2>
        </CardHeader>
        <CardContent>
          <DataTable
            data={backupData}
            columns={columnsBackup}
            columnTitleMap={columnTitleMap}
            name="Sampel Cadangan"
          />
        </CardContent>
      </Card>

      {dialogSamples.length > 0 && (
        <AddPengecekanDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleAddPengecekan}
          samples={dialogSamples}
        />
      )}
    </DashboardLayout>
  );
};

export default PengecekanPage;


