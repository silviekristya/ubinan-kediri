import React, { useState, useEffect, useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { DataTable } from '@/Components/Dashboard/Components/DataTable/DataTable';
import { Card, CardHeader, CardContent } from '@/Components/ui/card';
import { toast } from 'react-toastify';
import { generateColumns } from '@/Components/Dashboard/Components/DataTable/Components/Columns';
import { PageProps, Pengecekan, Sampel } from '@/types';
import { AddPengecekanDialog } from '@/Components/Dashboard/Components/Mitra/Pengecekan/AddPengecekanDialog';
import { EditPengecekanDialog } from '@/Components/Dashboard/Components/Mitra/Pengecekan/EditPengecekanDialog';
import { Inertia } from '@inertiajs/inertia';
import { Row } from '@tanstack/react-table';
import axios from 'axios';
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/Components/ui/button';
import { DataTableColumnHeader } from '@/Components/Dashboard/Components/DataTable/Components/DataTableColumnHeader';
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
  pml_nama: 'Nama PML',
  pengecekan_id: 'ID Pengecekan',
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

  // flatten
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
      pengecekan_id:        s.pengecekan?.id,
      tanggal_pengecekan:   s.pengecekan?.tanggal_pengecekan ?? '-',
      nama_responden:       s.pengecekan?.nama_responden     ?? '-',
      no_telepon_responden: s.pengecekan?.no_telepon_responden ?? '-',
      tanggal_panen:        s.pengecekan?.tanggal_panen      ?? '-',
      keterangan:           s.pengecekan?.keterangan          ?? '-',
      status_sampel:        s.pengecekan?.status_sampel      ?? 'Belum',
      // hasPengecekan:        Boolean(s.pengecekan),
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
      // console.log("Mengirim data pengecekan:", formData);
  
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

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const openEditDialog = (row: any) => {
    setEditData(row);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditData(null);
    setIsEditDialogOpen(false);
  };

  // Handler submit update
  const handleEditTanggalPanen = async (payload: { id: any; tanggal_panen: any; }) => {
    try {
      const res = await axios.post(`/dashboard/mitra/pengecekan/update/${payload.id}`, {
        tanggal_panen: payload.tanggal_panen,
      });
      if (res.data.status === "success") {
        toast.success(res.data.message);
        setIsEditDialogOpen(false);

        // Update state data di tabel langsung, TANPA reload
        setMainData(prev =>
          prev.map(item => {
            // Ubah pengecekan pada sampel yang sesuai
            if (item.pengecekan && item.pengecekan.id === payload.id) {
              return {
                ...item,
                pengecekan: {
                  ...item.pengecekan,
                  tanggal_panen: payload.tanggal_panen,
                },
              };
            }
            return item;
          })
        );
      } else {
        toast.error(res.data.message || "Gagal update.");
      }
    } catch (e) {
      const err = e as any;
      if (err.response?.status === 403) {
        toast.error(err.response.data.message || "Tidak bisa update saat ini.");
      } else {
        toast.error("Gagal update.");
      }
    }
  };


  // generateColumns: name, titleMap, customRender?, onDetail, onUpdateStatus, onEdit, onDelete
  const baseColumnsMain = generateColumns<Sampel>({
    name : 'pengecekanUtamaMitra',
    columnTitleMap:columnTitleMap,
  });

const [actionsColumn, checkboxColumn, ...dataColumns] = baseColumnsMain;

  // Tambahkan kolom aksi terakhir dengan tombol pengecekan
  const actionColumn: ColumnDef<Sampel> = {
  id: 'aksi-pengecekan',
  header: ({ column }) => (
    <DataTableColumnHeader
      column={column}
      title="Pengecekan"
      className="text-xs font-medium min-w-[180px]"
    />
  ),
  cell: ({ row }) => {
    // Ambil tanggal_panen dari pengecekan (atau dari row.getValue jika sudah flatten)
    const rawTanggalPanen = row.getValue('tanggal_panen');
    const tanggalPanen =
      typeof rawTanggalPanen === 'string' && rawTanggalPanen !== '-'
        ? dayjs(rawTanggalPanen).startOf('day')
        : null;
    const today = dayjs().startOf('day');
    const diff = tanggalPanen ? tanggalPanen.diff(today, 'day') : null;
    // Debugging log
    console.log('tanggalPanen:', tanggalPanen?.format('YYYY-MM-DD'), '| today:', today.format('YYYY-MM-DD'), '| diff:', diff);
  const canEdit = tanggalPanen && diff !== null && (diff >= 1 && diff <= 3);

    // Tombol tambah hanya jika status Belum
    const isDisabledTambah = row.getValue('status_sampel') !== 'Belum' || row.getValue('tanggal_pengecekan') !== '-';
    
    const pengecekanId = row.getValue('pengecekan_id');

    return (
      <div className="min-w-[180px] flex gap-2 justify-center">
        <Button
          size="sm"
          variant={isDisabledTambah ? 'outline' : 'default'}
          onClick={() => !isDisabledTambah && openAddDialog(row.original)}
          disabled={isDisabledTambah}
        >
          Tambah
        </Button>
        <Button
          size="sm"
          variant={canEdit ? 'default' : 'outline'}
          onClick={() => canEdit && openEditDialog({ id: row.getValue('pengecekan_id'), tanggal_panen: row.getValue('tanggal_panen')})}
          disabled={!canEdit || !pengecekanId}
        >
          Perbarui
        </Button>
      </div>
    );
  },
  enableSorting: false,
  enableColumnFilter: false,
  };

  
  // gabungkan jadi columnsMain
  const columnsMain: ColumnDef<Sampel>[] = [
    actionsColumn,
    checkboxColumn,
    actionColumn,
    ...dataColumns,
  ];

  const columnsBackup = generateColumns<Sampel>({
    name : 'pengecekanCadangan',
    columnTitleMap : columnTitleMap,
  });

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

      {isEditDialogOpen && editData && (
        <EditPengecekanDialog
          isOpen={isEditDialogOpen}
          onClose={closeEditDialog}
          data={editData}
          onSave={handleEditTanggalPanen}
        />
      )}

    </DashboardLayout>
  );
};

export default PengecekanPage;