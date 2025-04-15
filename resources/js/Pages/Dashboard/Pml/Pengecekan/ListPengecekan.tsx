// resources/js/Pages/Dashboard/Pml/Pengecekan/ListPengecekan.tsx

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
    switch (col) {
      case 'tanggal_pengecekan':   return p?.tanggal_pengecekan ?? '-';
      case 'nama_responden':       return p?.nama_responden     ?? '-';
      case 'no_telepon_responden': return p?.no_telepon_responden ?? '-';
      case 'tanggal_panen':        return p?.tanggal_panen      ?? '-';
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

      {/* Sampel Utama */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Sampel Utama</h2>
        <DataTable
          name="Sampel Utama"
          data={samplesUtama}
          columns={columnsWithAction}
          columnTitleMap={columnTitleMap}
        />
      </div>

       {/* Sampel Terverifikasi */}
       <div>
        <h2 className="text-lg font-semibold mb-4">Sampel Terverifikasi</h2>
        <DataTable
          name="Sampel Terverifikasi"
          data={samplesVerified}
          columns={columnsReadOnly}
          columnTitleMap={columnTitleMap}
        />
      </div>

      {/* Sampel Cadangan */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Sampel Cadangan</h2>
        <DataTable
          name="Sampel Cadangan"
          data={samplesCadangan}
          columns={columnsWithAction}
          columnTitleMap={columnTitleMap}
        />
      </div>


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
