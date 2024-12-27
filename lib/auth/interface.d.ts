export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    data: {
        id: string;
        nama: string;
        email: string;
        role: string;
        access_token: string;
        refresh_token: string;
    }
}