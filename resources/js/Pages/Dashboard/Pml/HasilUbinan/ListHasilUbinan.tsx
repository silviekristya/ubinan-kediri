// resources/js/Pages/Dashboard/Mitra/HasilUbinan/HasilUbinanPage.tsx
import React, { useState, useMemo } from 'react';
import { Head, usePage }            from '@inertiajs/react';
import DashboardLayout              from '@/Layouts/DashboardLayout';
import { DataTable }                from '@/Components/Dashboard/Components/DataTable/DataTable';
import { Card, CardHeader, CardContent } from '@/Components/ui/card';
import { Button }                   from '@/Components/ui/button';
import { Checkbox }                 from '@/Components/ui/checkbox';
import axios                        from 'axios';
import { toast }                    from 'react-toastify';
import type { PageProps, Fenomena, HasilUbinan, Pengecekan } from '@/types';
import { generateColumns }          from '@/Components/Dashboard/Components/DataTable/Components/Columns';
import type { ColumnDef }           from '@tanstack/react-table';
import { AddHasilUbinanDialog }     from '@/Components/Dashboard/Components/Mitra/HasilUbinan/AddHasilUbinanDialog';
import { EditHasilUbinanDialog }    from '@/Components/Dashboard/Components/Mitra/HasilUbinan/EditHasilUbinanDialog';

interface Props extends PageProps {
  pengecekans: Array<Pengecekan & { hasil_ubinan?: HasilUbinan }>;
  fenomenas: Fenomena[];
}

export default function HasilUbinanPage() {
  const { pengecekans: initial, fenomenas } = usePage<Props>().props;

  const [pengecekans, setPengecekans] = useState(initial);
  const [addOpen,    setAddOpen]      = useState(false);
  const [editOpen,   setEditOpen]     = useState(false);
  const [selCekId,   setSelCekId]     = useState<number>(0);
  const [selHasil,   setSelHasil]     = useState<any>(null);

  // 1. HANDLE VERIFY
  const handleVerify = async (hasilId: number) => {
    try {
      await axios.post(`/dashboard/pml/hasil-ubinan/verifikasi${hasilId}`, { is_verif: true });
      toast.success('Verifikasi berhasil');
      setPengecekans(old =>
        old.map(cek =>
          cek.hasil_ubinan?.id === hasilId
            ? { ...cek, hasil_ubinan: { ...cek.hasil_ubinan!, is_verif: true } }
            : cek
        )
      );
    } catch {
      toast.error('Gagal verifikasi');
    }
  };

  // 2. HANDLE ADD
  const handleAdd = async (data: any) => {
    try {
      const res = await axios.post('/dashboard/pml/hasil-ubinan/store', data);
      toast.success('Data berhasil ditambahkan');
      setPengecekans(old =>
        old.map(cek =>
          cek.id === data.pengecekan_id
            ? { ...cek, hasil_ubinan: res.data.data }
            : cek
        )
      );
      setAddOpen(false);
    } catch {
      toast.error('Gagal menambahkan data');
    }
  };

  // 3. HANDLE EDIT
  const handleEdit = async (data: any) => {
    try {
      const res = await axios.post(`/dashboard/pml/hasil-ubinan/update${data.id}`, data);
      toast.success('Data berhasil diperbarui');
      setPengecekans(old =>
        old.map(cek =>
          cek.hasil_ubinan?.id === data.id
            ? { ...cek, hasil_ubinan: res.data.data }
            : cek
        )
      );
      setEditOpen(false);
    } catch {
      toast.error('Gagal memperbarui data');
    }
  };

  // 4. MAPPING KE ROWS
  const rows = useMemo(
    () =>
      pengecekans.map(cek => ({
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
        fenomena_nama:      cek.hasil_ubinan?.fenomena?.nama ?? '-',
        is_verif:           Boolean(cek.hasil_ubinan?.is_verif),
        raw:                cek,
      })),
    [pengecekans]
  );

  // 5. RENDERER UNTUK KOLOM “Verifikasi”
  const customRender = (col: string, row: typeof rows[0]) => {
    if (col !== 'is_verif') return undefined;
    // Kalau belum ada hasil ubinan → disable checkbox
    if (!row.raw.hasil_ubinan) {
      return <Checkbox checked={false} disabled />;
    }
    // Kalau sudah ada hasil ubinan → seperti biasa
    return (
      <Checkbox
        checked={row.is_verif}
        disabled={row.is_verif}
        onCheckedChange={checked => checked && handleVerify(row.raw.hasil_ubinan!.id)}
      />
    );
  };
  

  // 6. KOLOM ADD / EDIT
  const actionColumn: ColumnDef<typeof rows[0]> = {
    id: 'Aksi',
    header: 'Aksi',
    cell: ({ row }) => {
      const cek = row.original.raw;
      return cek.hasil_ubinan ? (
        <Button size="sm" onClick={() => {
          setSelHasil({ ...cek.hasil_ubinan, pengecekan_id: cek.id });
          setEditOpen(true);
        }}>
          Edit
        </Button>
      ) : (
        <Button size="sm" onClick={() => {
          setSelCekId(cek.id);
          setAddOpen(true);
        }}>
          Tambah
        </Button>
      );
    },
  };

  // 7. KOLOM UTAMA
  const columnTitleMap: Record<string,string> = {
    pengecekan_id:      'ID Cek',
    status_sampel:      'Status Sampel',
    nama_responden:     'Responden',
    jenis_tanaman:      'Tanaman',
    nama_lokasi:        'Lokasi',
    tanggal_pencacahan: 'Tgl. Ubinan',
    status:             'Status',
    berat_hasil_ubinan: 'Berat (kg)',
    jumlah_rumpun:      'Rumpun',
    fenomena_nama:      'Fenomena',
    is_verif:           'Verifikasi',
  };

  const baseColumns = generateColumns<typeof rows[0]>({
    name:'mitraHasilUbinan',
    columnTitleMap:columnTitleMap,
    customRender:customRender
  });

  const columns = [...baseColumns, actionColumn];

  return (
    <DashboardLayout>
      <Head title="Hasil Ubinan" />

      <Card className="mb-6">
        <CardHeader className="flex-justify-center"><h2 className="text-lg font-semibold text-center">Hasil Ubinan</h2></CardHeader>
        <CardContent>
          <DataTable
            name="Hasil Ubinan"
            data={rows}
            columns={columns}
            columnTitleMap={columnTitleMap}
          />
        </CardContent>
      </Card>

      {/* Dialog Tambah */}
      <AddHasilUbinanDialog
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        pengecekanId={selCekId}
        fenomenas={fenomenas}
        onSave={handleAdd}
      />

      {/* Dialog Edit */}
      {selHasil && (
        <EditHasilUbinanDialog
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          hasil={selHasil}
          fenomenas={fenomenas}
          onSave={handleEdit}
        />
      )}
    </DashboardLayout>
  );
}
