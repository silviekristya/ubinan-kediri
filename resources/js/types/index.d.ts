export interface User {
    id: string
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
}

export interface Mitra {
    id: number
    user_id: string
    nama: string
    no_telepon?: string
    identitas?: string
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


export interface WithCsrf {
    _token: string;
}


export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
    csrf_token: string;
};
