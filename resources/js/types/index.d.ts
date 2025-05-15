export interface User {
    id: number
    email: string
    username: string
    password?: string
    pegawai?: Pegawai
    mitra?: Mitra
}
export interface Pegawai {
    id: number
    user_id: string
    nama: string
    no_telepon?: string
    role: 'ADMIN' | 'PEGAWAI'
    is_pml: boolean
    user?: User
}

export interface Mitra {
    id: number
    user_id: string
    tim_id?: number
    nama: string
    no_telepon?: string
    alamat?: string
    user?: User
    tim?: Tim
}

export interface Segmen {
    id_segmen: string
    nama_segmen: string
    kode_segmen: string
    kecamatan_id: string
    id?: string
    text?: string
}

export interface BlokSensus {
    id_bs: string
    nomor_bs: string
    kel_desa_id: string
    nama_kel_desa?: string
    id?: string
    text?: string
}

export interface Sls {
    id_sls: string
    nama_sls: string
    bs_id: string
    blokSensus?: BlokSensus
    id?: string
    text?: string
}

export interface Pengecekan {
    id: number;
    id_sampel: number;
    tanggal_pengecekan: string;
    subround: string;
    nama_responden: string;
    alamat_responden: string;
    no_telepon_responden: string;
    tanggal_panen: string;
    status_sampel?: 'Eligible' | 'Non-eligible' | 'Belum';
    keterangan?: string | null;
    id_sampel_cadangan?: number | null;
    created_at?: string;
    updated_at?: string;

    // optional back‐reference
    sampel?: Sampel;
    hasil_ubinan?: HasilUbinan;
} 

export interface Fenomena {
    id: number;
    nama: string;
    created_at?: string;
    updated_at?: string;
}

export interface HasilUbinan {
    id: number;
    pengecekan_id: number;
    tanggal_pencacahan: string;
    berat_hasil_ubinan?: number;
    jumlah_rumpun?: number;
    luas_lahan?: number;
    cara_penanaman?: string;
    jenis_pupuk?: string;
    penanganan_hama?: string;
    fenomena?: Fenomena;
    status: 'Selesai' | 'Gagal';
    is_verif?: boolean;
    created_at?: string;
    updated_at?: string;

    // optional back‐reference
    pengecekan?: Pengecekan;
}

export interface Fenomena{
    id: number;
    nama: string;
    created_at?: string;
    updated_at?: string;
}

export interface Tim {
    id: number;
    nama_tim: string;
    pml?: Pegawai | null; // Ubah tipe di sini
    pcl?: Mitra[];
    pml_id: number;
    pcl_count: number;
}

export interface Kecamatan {
    id: number
    kode_kecamatan: string
    nama_kecamatan: string
    kab_kota_id: string
}

export type JenisSampel = "Utama" | "Cadangan"
export type JenisTanaman = "Padi" | "Palawija"
export type JenisKomoditas =
  | "Padi"
  | "Jagung"
  | "Kedelai"
  | "Kacang Tanah"
  | "Ubi Kayu"
  | "Ubi Jalar"
  | "Lainnya"

export interface Sampel {
    id?: number
  jenis_sampel: JenisSampel           // enum Utama|Cadangan
  jenis_tanaman: JenisTanaman         // enum Padi|Palawija
  jenis_komoditas?: JenisKomoditas   // nullable
  frame_ksa?: string                  // varchar(20), nullable

  // FK ke wilayah administratif
  provinsi_id: string                 // string(2)
  kab_kota_id: string                 // string(4)
  kecamatan_id: string                // string(7)
  kel_desa_id: string                 // string(10)

  nama_lok: string                    // string, required

  segmen_id?: string                  // nullable FK
  subsegmen?: string                  // nullable
  strata?: string                     // nullable

  bulan_listing: string               // tinyint, but di UI string/number
  tahun_listing: string               // year

  fase_tanam?: string                 // nullable
  rilis: string                       // date, required
  a_random: string                    // required

  nks: string                         // varchar(20), required
  long: string                        // required
  lat: string                         // required
  subround: string                    // char(2), required

  pcl_id?: number                     // nullable FK
  tim_id?: number                     // nullable FK
  tim?: Tim                      // nullable FK
  pcl?: Mitra                   // nullable FK
  id_sls?: number                     // nullable FK
  nama_krt?: string                   // nullable
  pcl_nama?: string               // nullable
  pml_nama?: string               // nullable

  perkiraan_minggu_panen?: number     // nullable integer

  // timestamps (jika ingin expose)
  created_at?: string
  updated_at?: string

  pengecekan?: Pengecekan
  kecamatan?: Kecamatan
}

export interface SampelFormData extends Omit<Sampel,
  | "created_at"
  | "updated_at"
>, WithCsrf {}

export interface WithCsrf {
    _token: string;
}


export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
    csrf_token: string;
};
