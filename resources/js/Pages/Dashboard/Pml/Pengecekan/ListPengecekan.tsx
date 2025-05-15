import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { DataTable } from '@/Components/Dashboard/Components/DataTable/DataTable';
import { Button } from '@/Components/ui/button';
import { VerifyDialog } from '@/Components/Dashboard/Components/Pml/Pengecekan/AddVerifikasiDialog';
import axios from 'axios';
import { toast } from 'react-toastify';
import type { PageProps, Sampel } from '@/types';
import { generateColumns } from '@/Components/Dashboard/Components/DataTable/Components/Columns';
import type { ColumnDef } from '@tanstack/react-table';
import { Card, CardContent, CardHeader } from '@/Components/ui/card';
import dayjsLib from 'dayjs';


interface PengecekanPageProps extends PageProps {
  samplesUtama: (Sampel & { cadanganOptions: { id: number; label: string }[] })[];
  samplesCadangan: Sampel[];
  samplesVerified: Sampel[];
}

const columnTitleMap: Record<string, string> = {
  id: 'ID',
  jenis_sampel: 'Jenis Sampel',
  jenis_tanaman: 'Jenis Tanaman',
  tahun_listing: 'Tahun Listing',
  subround: 'Subround',
  nama_kec: 'Kecamatan',
  nama_lok: 'Lokasi',
  segmen_id: 'ID Segmen',
  nama_krt: 'Nama KRT',
  rilis: 'Rilis',
  nks: 'NKS',
  tanggal_pengecekan: 'Tgl. Pengecekan',
  nama_responden: 'Responden',
  no_telepon_responden: 'No. Telepon',
  tanggal_panen: 'Tgl. Panen',
  keterangan: 'Keterangan',
  status_sampel: 'Status',
};

export default function PengecekanPage() {
  const {
    samplesUtama,
    samplesCadangan,
    samplesVerified,
  } = usePage<PengecekanPageProps>().props;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCekId, setSelectedCekId] = useState<number>(0);
  const [cadanganOptions, setCadanganOptions] = useState<{ id: number; label: string }[]>([]);

  const openDialog = (row: Sampel & { cadanganOptions?: { id: number; label: string }[] }) => {
    const p = row.pengecekan;
    if (
      !p ||
      !p.tanggal_pengecekan ||
      !p.nama_responden ||
      !p.no_telepon_responden ||
      !p.tanggal_panen
    ) {
      return toast.error('Pengecekan oleh Mitra belum lengkap.');
    }
    setSelectedCekId(p.id);
    setCadanganOptions(row.cadanganOptions || []);
    setIsDialogOpen(true);
  };

  const handleSave = async (data: {
    id: number;
    status_sampel: 'Eligible' | 'NonEligible' | 'Belum';
    id_sampel_cadangan?: number;
  }) => {
    try {
      const { data: res } = await axios.post(
        '/dashboard/pml/pengecekan/store',
        data,
        { headers: { Accept: 'application/json' } }
      );
      if (res.status === 'success') {
        toast.success(res.message);
        setIsDialogOpen(false);
        window.location.reload();
      } else {
        toast.error(res.message || 'Gagal menyimpan verifikasi.');
      }
    } catch (e) {
      console.error(e);
      toast.error('Terjadi kesalahan saat menyimpan.');
    }
  };

  // custom renderer for pengecekan fields
  const customRender = (col: string, row: Sampel) => {
    const p = row.pengecekan;
    const kec = row.kecamatan;
    switch (col) {
      case 'nama_kec':           return kec?.nama_kecamatan ?? '-';
      case 'tanggal_pengecekan':   return p?.tanggal_pengecekan ? dayjsLib(p.tanggal_pengecekan).format('DD/MM/YYYY') : '-';
      case 'nama_responden':       return p?.nama_responden     ?? '-';
      case 'no_telepon_responden': return p?.no_telepon_responden ?? '-';
      case 'tanggal_panen':        return p?.tanggal_panen      ? dayjsLib(p.tanggal_panen).format('DD/MM/YYYY') : '-';
      case 'keterangan':           return p?.keterangan         ?? '-';
      case 'status_sampel':        return p?.status_sampel      ?? 'Belum';
      default: return undefined;
    }
  };

  const baseColumns = generateColumns<Sampel>(
    'pmlPengecekan',
    columnTitleMap,
    customRender
  );

  // action column: only for utama & cadangan tables
  const actionColumn: ColumnDef<Sampel> = {
    id: 'action',
    header: 'Aksi',
    cell: ({ row }) => {
      const p = row.original.pengecekan;
      const incomplete =
        !p ||
        !p.tanggal_pengecekan ||
        !p.nama_responden ||
        !p.no_telepon_responden ||
        !p.tanggal_panen;
      const already = p?.status_sampel && p.status_sampel !== 'Belum';
      const disabled = incomplete || already;

      return (
        <Button
          size="sm"
          variant={disabled ? 'outline' : 'default'}
          disabled={disabled}
          onClick={() => !disabled && openDialog(row.original as any)}
        >
          {already ? 'Terverifikasi' : 'Verifikasi'}
        </Button>
      );
    },
  };

  const columnsWithAction = [...baseColumns, actionColumn];
  const columnsReadOnly   = [...baseColumns];

  return (
    <DashboardLayout>
      <Head title="Verifikasi Pengecekan PML" />
      <Card className="mb-6">
        <CardHeader className="flex items-center justify-between space-x-4">
          <h2 className="text-lg font-semibold text-center">Sampel Utama</h2>
        </CardHeader>
        <CardContent>
          {/* Sampel Utama */}
          <DataTable
            name="Sampel Utama"
            data={samplesUtama}
            columns={columnsWithAction}
            columnTitleMap={columnTitleMap}
          />
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader className="flex items-center justify-between space-x-4">
          <h2 className="text-lg font-semibold text-center">Sampel Terverifikasi</h2>
        </CardHeader>
        <CardContent>
          {/* Sampel Terverifikasi */}
          <DataTable
          name="Sampel Terverifikasi"
          data={samplesVerified}
          columns={columnsReadOnly}
          columnTitleMap={columnTitleMap}
        />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="flex items-center justify-between space-x-4">
          <h2 className="text-lg font-semibold text-center">Sampel Cadangan</h2>
        </CardHeader>
        <CardContent>
          {/* Sampel Cadangan */}
          <DataTable
          name="Sampel Cadangan"
          data={samplesCadangan}
          columns={columnsWithAction}
          columnTitleMap={columnTitleMap}
        />
        </CardContent>
      </Card>

      {isDialogOpen && (
        <VerifyDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSave}
          pengecekanId={selectedCekId}
          cadanganOptions={cadanganOptions}
        />
      )}
    </DashboardLayout>
  );
}
function dayjs(tanggal_panen: string) {
  throw new Error('Function not implemented.');
}

