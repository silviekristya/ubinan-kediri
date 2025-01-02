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
    nama: string
    no_telepon?: string
    identitas?: string
    user?: User
}

export interface Segmen {
    id: number
    nama: string
}

export interface Subsegmen {
    id: number
    segmen_id: number
    nama: string
}

interface Tim {
    id: number;
    nama_tim: string;
    pml?: Pegawai | null; // Ubah tipe di sini
    ppl?: Mitra[];
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
