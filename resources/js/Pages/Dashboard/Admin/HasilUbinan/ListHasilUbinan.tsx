// resources/js/Pages/Dashboard/Admin/HasilUbinan/ListHasilUbinan.tsx
import React, { useMemo } from 'react'
import { Head, usePage } from '@inertiajs/react'
import DashboardLayout from '@/Layouts/DashboardLayout'
import { DataTable } from '@/Components/Dashboard/Components/DataTable/DataTable'
import { Card, CardHeader, CardContent } from '@/Components/ui/card'
import type { DataTableColumnDef } from '@/Components/Dashboard/Components/DataTable/Components/Columns'
import { generateColumns } from '@/Components/Dashboard/Components/DataTable/Components/Columns'
import type { PageProps, Pengecekan } from '@/types'

interface Props extends PageProps {
  hasilUbinan: Pengecekan[]  // dari controller Admin
}

// 1. Definisikan tipe baris yang sudah di-flatten
type FlatHasilUbinanRow = {
  id: number | undefined
  pengecekan_id: number
  tanggal_pengecekan: string
  nama_responden: string
  alamat_responden: string
  no_telepon_responden: string
  tanggal_panen: string
  status_sampel?: string
  keterangan?: string | null

  // dari sampel
  nks: string
  nama_krt: string
  strata: string
  bulan_listing: string
  tahun_listing: string
  subround: string
  // dari hasil_ubinan
  berat_hasil_ubinan: number | string
  jumlah_rumpun: number | string
  luas_lahan: number | string
  cara_penanaman: string
  jenis_pupuk: string
  penanganan_hama: string
  fenomena_nama: string
  status_pan: string
  is_verif: boolean
  waktu_input_ubinan: string
  petugas_pcl: string
  petugas_pml: string
}

export default function ListHasilUbinanAdmin() {
  const { hasilUbinan } = usePage<Props>().props

  // 2. Flatten data ke rows
  const rows = useMemo<FlatHasilUbinanRow[]>(() =>
    hasilUbinan.map(cek => ({
      id:                   cek.hasil_ubinan?.id,
      pengecekan_id:        cek.id,
      tanggal_pengecekan:   cek.tanggal_pengecekan ?? '',
      nama_responden:       cek.nama_responden,
      alamat_responden:     cek.alamat_responden,
      no_telepon_responden: cek.no_telepon_responden,
      tanggal_panen:        cek.tanggal_panen,
      status_sampel:        cek.status_sampel ?? '',
      keterangan:           cek.keterangan ?? '',

      // sampel
      nks:           cek.sampel?.nks              ?? '-',
      nama_krt:      cek.sampel?.nama_krt         ?? '-',
      strata:        cek.sampel?.strata           ?? '-',
      bulan_listing: cek.sampel?.bulan_listing    ?? '-',
      tahun_listing: cek.sampel?.tahun_listing    ?? '-',
      subround:    cek.sampel?.subround         ?? '-',
      petugas_pcl: cek.sampel?.pcl?.nama ?? '-',
      petugas_pml: cek.sampel?.tim?.pml?.nama ?? '-',
      // hasil_ubinan
      berat_hasil_ubinan: cek.hasil_ubinan?.berat_hasil_ubinan ?? '-',
      jumlah_rumpun:      cek.hasil_ubinan?.jumlah_rumpun      ?? '-',
      luas_lahan:         cek.hasil_ubinan?.luas_lahan         ?? '-',
      cara_penanaman:     cek.hasil_ubinan?.cara_penanaman     ?? '-',
      jenis_pupuk:        cek.hasil_ubinan?.jenis_pupuk        ?? '-',
      penanganan_hama:    cek.hasil_ubinan?.penanganan_hama    ?? '-',
      fenomena_nama:      cek.hasil_ubinan?.fenomena?.nama     ?? '-',
      status_pan:         cek.hasil_ubinan?.status            ?? '-',
      is_verif:           Boolean(cek.hasil_ubinan?.is_verif),
      waktu_input_ubinan: cek.hasil_ubinan?.created_at       ?? '-',
    })),
  [hasilUbinan])

  // 3. Buat columnTitleMap sesuai FlatHasilUbinanRow
  const columnTitleMap: Record<keyof FlatHasilUbinanRow, string> = {
    nks:                 'Nomor BS',
    nama_krt:            'Nama KRT',
    strata:              'Strata',
    bulan_listing:       'Bulan Listing',
    tahun_listing:       'Tahun Listing',
    subround:            'Subround',
    
    id:                   'ID Ubinan',
    pengecekan_id:        'ID Pengecekan',
    tanggal_pengecekan:   'Tgl. Pengecekan',
    nama_responden:       'Responden',
    alamat_responden:     'Alamat',
    no_telepon_responden: 'Telepon',
    tanggal_panen:        'Tgl. Panen',
    status_sampel:        'Status Sampel',
    keterangan:           'Keterangan',

    berat_hasil_ubinan:  'Berat Ubinan (kg)',
    jumlah_rumpun:       'Jumlah Rumpun',
    luas_lahan:          'Luas Lahan (m²)',
    cara_penanaman:      'Cara Penanaman',
    jenis_pupuk:         'Jenis Pupuk',
    penanganan_hama:     'Penanganan Hama',
    fenomena_nama:       'Fenomena',
    status_pan:          'Status Panen',
    is_verif:            'Verifikasi',
    petugas_pcl: 'Petugas PCL',
    petugas_pml: 'Petugas PML',
    waktu_input_ubinan:  'Waktu Input Ubinan',
  }

  // 4. Generate columns, dengan custom untuk is_verif
  const columns = generateColumns<FlatHasilUbinanRow>(
    'Hasil Ubinan Admin',
    columnTitleMap,
    undefined, // no customRender needed
  )

  return (
    <DashboardLayout>
      <Head title="Semua Hasil Ubinan" />
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-center text-lg font-semibold">Semua Hasil Ubinan</h2>
        </CardHeader>
        <CardContent>
          <DataTable
            name="Hasil Ubinan Admin"
            data={rows}
            columns={columns as DataTableColumnDef<FlatHasilUbinanRow>[]}
            columnTitleMap={columnTitleMap}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
