import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { DataTable } from '@/Components/Dashboard/Components/DataTable/DataTable';
import { Card, CardHeader, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import axios from 'axios';
import { toast } from 'react-toastify';
import type { PageProps, Sampel, Fenomena } from '@/types';
import { generateColumns } from '@/Components/Dashboard/Components/DataTable/Components/Columns';
import type { ColumnDef } from '@tanstack/react-table';
import { AddHasilUbinanDialog } from '@/Components/Dashboard/Components/Mitra/HasilUbinan/AddHasilUbinanDialog';
import { EditHasilUbinanDialog } from '@/Components/Dashboard/Components/Mitra/HasilUbinan/EditHasilUbinanDialog';
import { Checkbox } from '@/Components/ui/checkbox'; // Adjust the path if necessary

interface HasilUbinanPageProps extends PageProps {
  samples: Array<
    Sampel & {
      pengecekan: {
        pengecekan_id: number;
        status_sampel: string;
        nama_responden: string;
        hasil_ubinan?: {
          id: number;
          tanggal_pencacahan: string;
          status: 'Selesai' | 'Gagal';
          berat_hasil_ubinan?: number;
          jumlah_rumpun?: number;
          luas_lahan?: number;
          cara_penanaman?: string;
          jenis_pupuk?: string;
          penanganan_hama?: string;
          fenomena?: { id: number; nama: string };
          is_verif?: boolean;
        };
      };
    }
  >;
  fenomenas: Fenomena[];
}

export default function HasilUbinanPage() {
  const { samples: rawSamples, fenomenas = [] } = usePage<HasilUbinanPageProps>().props;

  const [addOpenHasilUbinanDialog, setAddOpenHasilUbinanDialog] = useState(false);
  const [editOpenHasilUbinanDialog, setEditOpenHasilUbinanDialog] = useState(false);
  const [selectedPengecekanId, setSelectedPengecekanId] = useState<number>(0);
  const [selectedHasil, setSelectedHasil] = useState<any>(null);

  const openAddDialog = (row: typeof samples[0]) => {
    setSelectedPengecekanId(row.pengecekan.id);
    setAddOpenHasilUbinanDialog(true);
  };

  const openEditDialog = (row: typeof samples[0]) => {
    setSelectedHasil({
      ...row.pengecekan.hasil_ubinan,
      pengecekan_id: row.pengecekan.id,
    });
    setEditOpenHasilUbinanDialog(true);
  };

  const handleAddHasilUbinan = async (data: any) => {
    try {
      const { data: res } = await axios.post(
        '/dashboard/mitra/hasil-ubinan/store',
        data,
        { headers: { Accept: 'application/json' } }
      );
      if (res.status === 'success') {
        toast.success(res.message);
        setAddOpenHasilUbinanDialog(false);
        window.location.reload();
      } else {
        toast.error(res.message || 'Gagal menyimpan hasil ubinan.');
      }
    } catch (e) {
      console.error(e);
      toast.error('Terjadi kesalahan saat menyimpan.');
    }
  };

  const handleEdit = async (data: any) => {
    try {
      const { data: res } = await axios.put(
        `/dashboard/mitra/hasil-ubinan/${data.id}`,
        data,
        { headers: { Accept: 'application/json' } }
      );
      if (res.status === 'success') {
        toast.success(res.message);
        setEditOpenHasilUbinanDialog(false);
        window.location.reload();
      } else {
        toast.error(res.message || 'Gagal memperbarui hasil ubinan.');
      }
    } catch (e) {
      console.error(e);
      toast.error('Terjadi kesalahan saat memperbarui.');
    }
  };

  const samples = rawSamples.map(s => ({
    ...s,
    // field dari pengecekan
    pengecekan_id:      s.pengecekan.id,
    status_sampel:      s.pengecekan.status_sampel,
    nama_responden:     s.pengecekan.nama_responden,
    // field dari hasilUbinan (atau '-' kalau belum ada)
    tanggal_pencacahan: s.pengecekan.hasil_ubinan?.tanggal_pencacahan ?? '-',
    status:             s.pengecekan.hasil_ubinan?.status ?? '-',
    berat_hasil_ubinan: s.pengecekan.hasil_ubinan?.berat_hasil_ubinan ?? '-',
    jumlah_rumpun:      s.pengecekan.hasil_ubinan?.jumlah_rumpun ?? '-',
    luas_lahan:         s.pengecekan.hasil_ubinan?.luas_lahan ?? '-',
    cara_penanaman:     s.pengecekan.hasil_ubinan?.cara_penanaman ?? '-',
    jenis_pupuk:        s.pengecekan.hasil_ubinan?.jenis_pupuk ?? '-',
    penanganan_hama:    s.pengecekan.hasil_ubinan?.penanganan_hama ?? '-',
    fenomena_nama:      s.pengecekan.hasil_ubinan?.fenomena?.nama ?? '-',
    is_verif:           !!s.pengecekan.hasil_ubinan?.is_verif,
  }));

  const columnTitleMap: Record<string, string> = {
    pengecekan_id: 'ID Pengecekan',
    status_sampel: 'Status Sampel',
    nama_responden: 'Nama Responden',
    tanggal_pencacahan: 'Tgl. Pencacahan',
    status: 'Status',
    berat_hasil_ubinan: 'Berat (kg)',
    jumlah_rumpun: 'Jumlah Rumpun',
    luas_lahan: 'Luas Lahan (ha)',
    cara_penanaman: 'Cara Penanaman',
    jenis_pupuk: 'Jenis Pupuk',
    penanganan_hama: 'Penanganan Hama',
    fenomena_id: 'Fenomena',
    is_verif: 'Verifikasi',
  };

  const customRender = (col: string, row: typeof samples[0]) => {
    if (col === 'is_verif') {
        return <Checkbox checked={row.is_verif} disabled />;
      }
      return undefined;
  };

  const baseColumns = generateColumns<typeof samples[0]>(
    'mitraHasilUbinan',
    columnTitleMap,
    customRender,
    undefined,
    undefined,
    handleEdit,
    undefined,
    undefined
);

  const actionColumn: ColumnDef<typeof samples[0]> = {
    id: 'action',
    header: 'Aksi',
    cell: ({ row }) => {
      const hasHasil = !!row.original.pengecekan.hasil_ubinan;
      return hasHasil ? (
        <Button size="sm" onClick={() => openEditDialog(row.original)}>
          Edit
        </Button>
      ) : (
        <Button size="sm" onClick={() => openAddDialog(row.original)}>
          Tambah
        </Button>
      );
    },
  };

  const columns = [...baseColumns, actionColumn];

  return (
    <DashboardLayout>
      <Head title="Hasil Ubinan" />

      {/* <h1 className="text-2xl font-semibold mb-4">Hasil Ubinan</h1> */}
    <Card className="mb-6">
        <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Hasil Ubinan</h2>
        </CardHeader>
        <CardContent>
            <DataTable
                name="Hasil Ubinan"
                data={samples}
                columns={columns}
                columnTitleMap={columnTitleMap}
            />
        </CardContent>
    </Card>

      <AddHasilUbinanDialog
        isOpen={addOpenHasilUbinanDialog}
        onClose={() => setAddOpenHasilUbinanDialog(false)}
        onSave={handleAddHasilUbinan}
        pengecekanId={selectedPengecekanId}
        fenomenas={fenomenas}
      />

      {selectedHasil && (
        <EditHasilUbinanDialog
          isOpen={editOpenHasilUbinanDialog}
          onClose={() => setEditOpenHasilUbinanDialog(false)}
          onSave={handleEdit}
          hasil={selectedHasil}
          fenomenas={fenomenas}
        />
      )}
    </DashboardLayout>
  );
}
