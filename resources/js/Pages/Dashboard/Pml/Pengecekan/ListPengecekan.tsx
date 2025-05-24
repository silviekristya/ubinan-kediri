// resources/js/Pages/Dashboard/Pml/Pengecekan/ListPengecekan.tsx
import React, { useState, useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { DataTable } from '@/Components/Dashboard/Components/DataTable/DataTable';
import { Button } from '@/Components/ui/button';
import { VerifyDialog } from '@/Components/Dashboard/Components/Pml/Pengecekan/AddVerifikasiDialog';
import axios from 'axios';
import { toast } from 'react-toastify';
import type { PageProps, Sampel, Pengecekan } from '@/types';
import { generateColumns } from '@/Components/Dashboard/Components/DataTable/Components/Columns';
import type { ColumnDef } from '@tanstack/react-table';
import { Card, CardContent, CardHeader } from '@/Components/ui/card';

type Props = PageProps & {
  samplesUtama:    Array<Sampel & { pengecekan?: Pengecekan; cadanganOptions: { id: number; label: string }[] }>;
  samplesVerified: Array<Sampel & { pengecekan?: Pengecekan }>;
  samplesCadangan: Array<Sampel & { pengecekan?: Pengecekan }>;
};

const columnTitleMap = {
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
  const { samplesUtama, samplesVerified, samplesCadangan } = usePage<Props>().props;

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCekId, setSelectedCekId] = useState<number | null>(null);
  const [cadanganOptions, setCadanganOptions] = useState<{ id: number; label: string }[]>([]);

  // flatten jadi row-level object
  const rowsUtama = useMemo(() =>
    samplesUtama.map(s => ({
      ...s, // biar you still punya id, jenis_sampel, dll
      nama_kec: s.kecamatan?.nama_kecamatan ?? '-',
      tanggal_pengecekan: s.pengecekan?.tanggal_pengecekan ?? '-',
      nama_responden: s.pengecekan?.nama_responden ?? '-',
      no_telepon_responden: s.pengecekan?.no_telepon_responden ?? '-',
      tanggal_panen: s.pengecekan?.tanggal_panen ?? '-',
      keterangan: s.pengecekan?.keterangan ?? '-',
      status_sampel: s.pengecekan?.status_sampel ?? 'Belum',
    })), [samplesUtama]
  );

  const rowsVerified = useMemo(() =>
    samplesVerified.map(s => ({
      ...s,
      nama_kec: s.kecamatan?.nama_kecamatan ?? '-',
      tanggal_pengecekan: s.pengecekan?.tanggal_pengecekan ?? '-',
      nama_responden: s.pengecekan?.nama_responden ?? '-',
      no_telepon_responden: s.pengecekan?.no_telepon_responden ?? '-',
      tanggal_panen: s.pengecekan?.tanggal_panen ?? '-',
      keterangan: s.pengecekan?.keterangan ?? '-',
      status_sampel: s.pengecekan?.status_sampel ?? 'Belum',
    })), [samplesVerified]
  );

  const rowsCadangan = useMemo(() =>
    samplesCadangan.map(s => ({
      ...s,
      nama_kec: s.kecamatan?.nama_kecamatan ?? '-',
      tanggal_pengecekan: s.pengecekan?.tanggal_pengecekan ?? '-',
      nama_responden: s.pengecekan?.nama_responden ?? '-',
      no_telepon_responden: s.pengecekan?.no_telepon_responden ?? '-',
      tanggal_panen: s.pengecekan?.tanggal_panen ?? '-',
      keterangan: s.pengecekan?.keterangan ?? '-',
      status_sampel: s.pengecekan?.status_sampel ?? 'Belum',
    })), [samplesCadangan]
  );

  // generate columns default (akses langsung ke field di row)
  const baseColumns = generateColumns<typeof rowsUtama[0]>(
    'pmlPengecekan',
    columnTitleMap
  );

  // action column untuk verifikasi
  const actionColumn: ColumnDef<typeof rowsUtama[0]> = {
    id: 'action',
    header: 'Aksi',
    cell: ({ row }) => {
      const p = row.original.pengecekan;
      const incomplete = !!p && (!p?.status_sampel || p?.status_sampel === 'Belum');
      return (
        <Button
          size="sm"
          variant={incomplete ? 'default' : 'outline'}
          disabled={!incomplete}
          onClick={() => openDialog(row.original as any)}
        >
          {incomplete ? 'Verifikasi' : 'Terverifikasi'}
        </Button>
      );
    },
  };

  const columnsWithAction = [...baseColumns, actionColumn];
  const columnsReadOnly   = [...baseColumns];

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

  const openDialog = (row: Sampel & { pengecekan?: Pengecekan; cadanganOptions?: { id: number; label: string }[] }) => {
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
    // kirim data ke dialog
    setSelectedCekId(p.id);
    setCadanganOptions(row.cadanganOptions || []);
    setIsDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <Head title="Verifikasi Pengecekan PML" />

      <Card className="mb-6">
        <CardHeader><h2>Sampel Utama</h2></CardHeader>
        <CardContent>
          <DataTable
            name="Sampel Utama"
            data={rowsUtama}
            columns={columnsWithAction}
            columnTitleMap={columnTitleMap}
          />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader><h2>Sampel Terverifikasi</h2></CardHeader>
        <CardContent>
          <DataTable
            name="Sampel Terverifikasi"
            data={rowsVerified}
            columns={columnsReadOnly}
            columnTitleMap={columnTitleMap}
          />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader><h2>Sampel Cadangan</h2></CardHeader>
        <CardContent>
          <DataTable
            name="Sampel Cadangan"
            data={rowsCadangan}
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
          pengecekanId={selectedCekId ?? 0}
          cadanganOptions={cadanganOptions}
        />
      )}
    </DashboardLayout>
  );
}
