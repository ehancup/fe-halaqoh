import { BaseResponsePagination } from "../axios/axiosClient";

export interface GetAbsenSantriResnponse extends BaseResponsePagination {
  data: AbsenSantriData[];
}
export interface GetDetailAbsenSantriResnponse {
  status: string;
  message: string;
  data: AbsenSantriData;
}

export interface AbsenSantriData {
  id: number;
  dariSurat: string | null;
  sampaiSurat: string | null;
  dariAyat: number | null;
  sampaiAyat: number | null;
  status: string;
  tipe: string;
  namaMusrif: string;
  keterangan: string | null;
  created_at: string;
  created_by: {
    id: number;
    nama: String;
  };
  // pengampuh: {
  //   id: number;
  //   nama: String;
  // };
  santri: {
    id: number;
    nama_santri: string;
    kelas: number;
  };
}

export interface AbsenSantriPayload {
  dariSurat: string;
  sampaiSurat: string;
  dariAyat: number | null;
  sampaiAyat: number | null;
  status: "HADIR" | "TIDAK_HADIR" | "IZIN" | "SAKIT" | "ALPHA";
  keterangan: string;
}
