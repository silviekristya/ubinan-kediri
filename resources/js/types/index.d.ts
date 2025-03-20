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
    frame_ksa?: string | null;
    prov: string;
    kab: string;
    kec: string;
    nama_prov: string;
    nama_kab: string;
    nama_kec: string;
    nama_lok: string;
    segmen_id?: number | null;  // Tipe foreignId, bisa number
    subsegmen?: string | null;
    strata?: string | null;
    bulan_listing: string;
    tahun_listing: string;
    fase_tanam?: string | null;
    rilis?: string | null;                // date di DB, tapi string di FE
    a_random?: string | null;
    nks: string;
    long: string;
    lat: string;
    subround: string;
    pcl_id?: number | null;
    tim_id?: number | null;
    id_sls?: number | null;
    nama_krt?: string | null;
    perkiraan_minggu_panen?: number | null;
    created_at?: string;
    updated_at?: string;
}
interface Tim {
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
