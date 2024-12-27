import { BaseResponsePagination } from "../axios/axiosClient";

export interface AddMusrifPayload {
    nama_musrif: string;
}

export interface EditMusrifPayload extends AddMusrifPayload {}

export interface MusrifData {
    id: number;
    nama_musrif: string;
    created_at: string;
    created_by: {
        id: number;
        nama: string
    }
}

export interface GetMusrifResponse extends BaseResponsePagination{
    data: MusrifData[]
}
export interface GetDetailMusrifResponse {
    data: MusrifData    
}