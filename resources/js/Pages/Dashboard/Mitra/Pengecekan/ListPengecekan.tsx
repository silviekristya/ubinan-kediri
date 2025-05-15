// resources/js/Pages/Dashboard/Mitra/Pengecekan/Index.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { DataTable } from '@/Components/Dashboard/Components/DataTable/DataTable';
import { Card, CardHeader, CardContent } from '@/Components/ui/card';
import { toast } from 'react-toastify';
import { generateColumns } from '@/Components/Dashboard/Components/DataTable/Components/Columns';
import { PageProps, Pengecekan, Sampel } from '@/types';
import { AddPengecekanDialog } from '@/Components/Dashboard/Components/Mitra/Pengecekan/AddPengecekanDialog';
import { Inertia } from '@inertiajs/inertia';
import { Row } from '@tanstack/react-table';
import axios from 'axios';
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/Components/ui/button';
import dayjs from 'dayjs';
import utc   from 'dayjs/plugin/utc';
import 'dayjs/locale/id';

dayjs.extend(utc);
dayjs.locale('id');


interface PengecekanPageProps extends PageProps {
  mainSamples: Array<Sampel & { pengecekan?: Pengecekan }>;
  backupSamples: Array<Sampel & { pengecekan?: Pengecekan }>;
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

  useEffect(() => { setMainData(mainSamples); }, [mainSamples]);
  useEffect(() => { setBackupData(backupSamples); }, [backupSamples]);

  // flatten + memoize
  const makeRows = (
    arr: Array<Sampel & { pengecekan?: Pengecekan }>
  ) =>
    arr.map(s => ({
      id:                   s.id,
      jenis_sampel:         s.jenis_sampel,
      jenis_tanaman:        s.jenis_tanaman,
      tahun_listing:        s.tahun_listing,
      subround:             s.subround,
      nama_kec:             s.kecamatan?.nama_kecamatan ?? '-',
      nama_lok:             s.nama_lok,
      segmen_id:            s.segmen_id,
      nama_krt:             s.nama_krt,
      rilis:                s.rilis,
      nks:                  s.nks,
      tanggal_pengecekan:   s.pengecekan?.tanggal_pengecekan ?? '-',
      nama_responden:       s.pengecekan?.nama_responden     ?? '-',
      no_telepon_responden: s.pengecekan?.no_telepon_responden ?? '-',
      tanggal_panen:        s.pengecekan?.tanggal_panen      ?? '-',
      keterangan:           s.pengecekan?.keterangan          ?? '-',
      status_sampel:        s.pengecekan?.status_sampel      ?? 'Belum',
      pcl_nama:             s.pcl?.nama,
      pml_nama:             s.tim?.pml?.nama,
    }));

  const rowsMain   = useMemo(() => makeRows(mainData),   [mainData]);
  const rowsBackup = useMemo(() => makeRows(backupData), [backupData]);


  // Fungsi untuk membuka dialog "tambah pengecekan"
  const openAddDialog = (row: Sampel) => {
    setDialogSamples([row]);
    console.log("Membuka dialog untuk sampel:", row);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setDialogSamples([]);
  };

    // const handleEdit = (id: string, data: any) => {
  //   setDialogSamples([data as Sampel]);
  //   setIsDialogOpen(true);
  // };

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
    undefined,
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
      const hasChecked = row.original.status_sampel && row.original.tanggal_pengecekan !== '-';
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
            data={rowsMain}
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
            data={rowsBackup}
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


