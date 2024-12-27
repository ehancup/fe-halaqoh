import { BaseResponsePagination } from "../axios/axiosClient";

export interface AddSantriPayload {
  nama_santri: string;
  musrif_id: number | null;
  kelas: number | null;
}

export interface EditSantriPayload extends AddSantriPayload {}

export interface GetSantriResponse extends BaseResponsePagination {
  data: {
    id: number;
    nama_santri: string;
    musrif: {
      id: number;
      nama_musrif: string;
    } | null;
    created_by: {
      id: number;
      nama: string;
    };
    updated_by: {
      id: number;
      nama: string;
    } | null;
  }[];
}

export interface GetDetailSantriResponse {
  data: {
    id: number;
    nama_santri: string;
    kelas: number;
    musrif: {
      id: number;
      nama_musrif: string;
    } | null;
  };
}
