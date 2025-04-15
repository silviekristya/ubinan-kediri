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
}

export interface BlokSensus {
    id: number
    nomor_bs: string
}

export interface NamaSls {
    id: number
    nama_sls: string
    id_bs: number
    blok_sensus?: BlokSensus
}

export interface Sampel {
    id: number;
    jenis_sampel: "Utama" | "Cadangan";
    jenis_tanaman: "Padi" | "Palawija";
    jenis_komoditas: "Padi" | "Jagung" | "Kedelai" | "Kacang Tanah" | "Ubi Kayu" | "Ubi Jalar" | "Lainnya";
    frame_ksa?: string; // varchar(20), nullable
    prov: string; // varchar(5), not null
    kab: string; // varchar(5), not null
    kec: string; // varchar(5), not null
    nama_prov: string;
    nama_kab: string;
    nama_kec: string;
    nama_lok: string;
    segmen_id?: string; // nullable
    subsegmen?: string; // varchar(5), nullable
    id_sls?: number; // bigint, nullable
    nama_sls?: NamaSls;
    nomor_bs?: BlokSensus;
    nama_krt?: string; // nullable
    strata?: string; // varchar(5), nullable
    bulan_listing: string;
    tahun_listing: string;
    fase_tanam?: string; // nullable
    rilis: string; // date, bisa dideklarasikan sebagai string atau Date sesuai kebutuhan
    a_random: string;
    nks: string; // varchar(20), not null
    long: string;
    lat: string;
    subround: string; // varchar, not null (misalnya 2 karakter)
    perkiraan_minggu_panen?: number; // integer, nullable
    pcl_id?: number;
    tim_id?: number;
    tim?: Tim;
    pcl?: Mitra;
    pengecekan?: Pengecekan;
    created_at?: string;
    updated_at?: string;
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
    status: 'Selesai' | 'Gagal';
    is_verif?: boolean;
    created_at?: string;
    updated_at?: string;

    // optional back‐reference
    pengecekan?: Pengecekan;
}



export interface Tim {
    id: number;
    nama_tim: string;
    pml?: Pegawai | null; // Ubah tipe di sini
    pcl?: Mitra[];
    pml_id: number;
}


export interface WithCsrf {
    _token: string;
}


export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
    csrf_token: string;
};
