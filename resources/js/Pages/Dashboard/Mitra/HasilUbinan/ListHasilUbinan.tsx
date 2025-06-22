// resources/js/Pages/Dashboard/Mitra/HasilUbinan/HasilUbinanPage.tsx
import React, { useState, useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { DataTable } from '@/Components/Dashboard/Components/DataTable/DataTable';
import { Card, CardHeader, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import axios from 'axios';
import { toast } from 'react-toastify';
import type { PageProps, Fenomena, HasilUbinan, Pengecekan } from '@/types';
import { generateColumns } from '@/Components/Dashboard/Components/DataTable/Components/Columns';
import type { ColumnDef } from '@tanstack/react-table';
import { AddHasilUbinanDialog } from '@/Components/Dashboard/Components/Mitra/HasilUbinan/AddHasilUbinanDialog';
import { EditHasilUbinanDialog } from '@/Components/Dashboard/Components/Mitra/HasilUbinan/EditHasilUbinanDialog';
import { Checkbox } from '@/Components/ui/checkbox';

interface HasilUbinanPageProps extends PageProps {
  pengecekans: Array<
    Pengecekan & {
      hasil_ubinan?: HasilUbinan;
    }
  >;
  fenomenas: Fenomena[];
}

export default function HasilUbinanPage() {
  // ambil props awal dari Inertia
  const { pengecekans: initialPengecekans, fenomenas } =
    usePage<HasilUbinanPageProps>().props;

  // local state untuk pengecekans, supaya bisa mutate add/edit tanpa full refresh
  const [pengecekans, setPengecekans] = useState(initialPengecekans);

  // state untuk dialog
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedPengecekanId, setSelectedPengecekanId] = useState<number>(0);
  const [selectedHasil, setSelectedHasil] = useState<any>(null);

  // mapping ke rows untuk DataTable
  const rows = useMemo(
    () =>
      pengecekans.map((cek) => ({
        id:                 cek.hasil_ubinan?.id,
        pengecekan_id:      cek.id,
        status_sampel:      cek.status_sampel,
        nama_responden:     cek.nama_responden,
        jenis_tanaman:      cek.sampel?.jenis_tanaman,
        nama_lokasi:        cek.sampel?.nama_lok,
        nks:                cek.sampel?.nks,
        tanggal_pencacahan: cek.hasil_ubinan?.tanggal_pencacahan ?? '-',
        status:             cek.hasil_ubinan?.status ?? '-',
        berat_hasil_ubinan: cek.hasil_ubinan?.berat_hasil_ubinan ?? '-',
        jumlah_rumpun:      cek.hasil_ubinan?.jumlah_rumpun ?? '-',
        luas_lahan:         cek.hasil_ubinan?.luas_lahan ?? '-',
        cara_penanaman:     cek.hasil_ubinan?.cara_penanaman ?? '-',
        jenis_pupuk:        cek.hasil_ubinan?.jenis_pupuk ?? '-',
        penanganan_hama:    cek.hasil_ubinan?.penanganan_hama ?? '-',
        fenomena_id:        cek.hasil_ubinan?.fenomena?.id ?? null,
        fenomena_nama:      cek.hasil_ubinan?.fenomena?.nama ?? '-',
        is_verif:           Boolean(cek.hasil_ubinan?.is_verif),
        pengecekan:         cek,
      })),
    [pengecekans]
  );

  // open Add dialog
  const openAddDialog = (row: typeof rows[0]) => {
    setSelectedPengecekanId(row.pengecekan_id);
    setAddOpen(true);
  };

  // open Edit dialog
  const openEditDialog = (row: typeof rows[0]) => {
    setSelectedHasil({
      id:                 row.id!,
      tanggal_pencacahan: row.tanggal_pencacahan !== '-' ? row.tanggal_pencacahan : undefined,
      status:             row.status as 'Selesai' | 'Gagal',
      berat_hasil_ubinan: row.berat_hasil_ubinan !== '-' ? row.berat_hasil_ubinan : undefined,
      jumlah_rumpun:      row.jumlah_rumpun    !== '-' ? row.jumlah_rumpun    : undefined,
      luas_lahan:         row.luas_lahan       !== '-' ? row.luas_lahan       : undefined,
      cara_penanaman:     row.cara_penanaman   !== '-' ? row.cara_penanaman   : undefined,
      jenis_pupuk:        row.jenis_pupuk      !== '-' ? row.jenis_pupuk      : undefined,
      penanganan_hama:    row.penanganan_hama  !== '-' ? row.penanganan_hama  : undefined,
      fenomena_id:        row.fenomena_id || undefined,
      pengecekan_id:      row.pengecekan_id,
    });
    setEditOpen(true);
  };

  // handle Add: simpan lewat axios, lalu update local state
  const handleAdd = async (data: any) => {
    try {
      const res = await axios.post(
        '/dashboard/mitra/hasil-ubinan/store',
        data,
        { headers: { Accept: 'application/json' } }
      );
      toast.success(res.data.message);
      setAddOpen(false);

      // update state: sisipkan hasil_ubinan baru
      const created: HasilUbinan = res.data.data;
      setPengecekans((old) =>
        old.map((cek) =>
          cek.id === created.pengecekan_id
            ? { ...cek, hasil_ubinan: created }
            : cek
        )
      );
    } catch {
      toast.error('Gagal menyimpan hasil ubinan.');
    }
  };

  // handle Edit: simpan lewat axios, lalu update local state
  const handleEdit = async (data: any) => {
    try {
      const res = await axios.post(
        `/dashboard/mitra/hasil-ubinan/update${data.id}`,
        data,
        { headers: { Accept: 'application/json' } }
      );
      toast.success(res.data.message);
      setEditOpen(false);

      // update state: ganti hasil_ubinan yang di-edit
      const updated: HasilUbinan = res.data.data;
      setPengecekans((old) =>
        old.map((cek) =>
          cek.id === updated.pengecekan_id
            ? { ...cek, hasil_ubinan: updated }
            : cek
        )
      );
    } catch {
      toast.error('Gagal memperbarui hasil ubinan.');
    }
  };

  // judul kolom
  const columnTitleMap: Record<string, string> = {
    pengecekan_id:      'ID Pengecekan',
    status_sampel:      'Status Sampel',
    nama_responden:     'Nama Responden',
    jenis_tanaman:      'Jenis Tanaman',
    nama_lokasi:        'Lokasi',
    tanggal_pencacahan: 'Tgl. Pencacahan',
    status:             'Status Ubinan',
    berat_hasil_ubinan: 'Berat (kg)',
    jumlah_rumpun:      'Jumlah Rumpun',
    luas_lahan:         'Luas (ha)',
    cara_penanaman:     'Cara Tanam',
    jenis_pupuk:        'Jenis Pupuk',
    penanganan_hama:    'Hama',
    fenomena_nama:      'Fenomena',
    is_verif:           'Verifikasi',
  };

  // custom render untuk checkbox
  const customRender = (col: string, row: typeof rows[0]) => {
    if (col === 'is_verif') return <Checkbox checked={row.is_verif} disabled />;
    return undefined;
  };

  // generate base columns
  const baseColumns = generateColumns<typeof rows[0]>({
    name:'mitraHasilUbinan',
    columnTitleMap:columnTitleMap,
    customRender:customRender
  });

  // kolom aksi: Add vs Edit
  const actionColumn: ColumnDef<typeof rows[0]> = {
    id: 'Aksi',
    header: 'Aksi',
    cell: ({ row }) => {
      const hasData = row.original.berat_hasil_ubinan !== '-';
      return hasData ? (
        <Button type="button" size="sm" onClick={(e) => { 
          e.stopPropagation();      // <-- cegah bubbling
          openEditDialog(row.original);
        }}
      >Edit</Button>
      ) : (
        <Button type="button" size="sm" onClick={(e) => {
          e.stopPropagation();
          openAddDialog(row.original);
        }}
      >Tambah</Button>
      );
    },
  };

  const columns = [...baseColumns, actionColumn];

  return (
    <DashboardLayout>
      <Head title="Hasil Ubinan" />

      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold">Hasil Ubinan</h2>
        </CardHeader>
        <CardContent>
          <DataTable
            name="Hasil Ubinan"
            data={rows}
            columns={columns}
            columnTitleMap={columnTitleMap}
          />
        </CardContent>
      </Card>

      <AddHasilUbinanDialog
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={handleAdd}
        pengecekanId={selectedPengecekanId}
        fenomenas={fenomenas}
      />

      {selectedHasil && (
        <EditHasilUbinanDialog
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          onSave={handleEdit}
          hasil={selectedHasil}
          fenomenas={fenomenas}
        />
      )}
    </DashboardLayout>
  );
}
