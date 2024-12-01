export interface User {
    id: string;
    nama: string;
    email: string;
    password?: string;
    no_telepon?: string;
    role: string;
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
