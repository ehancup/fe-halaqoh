import { BaseResponsePagination } from "../axios/axiosClient";

export interface GetAbsenMusrifResponse extends BaseResponsePagination{
    data: {
        id: number;
        hadir: boolean;
        shift: string;
        tanggal_masuk: string;
        tanggal_keluar: string;
    }[]
}