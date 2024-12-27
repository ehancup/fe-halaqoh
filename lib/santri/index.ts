import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "../hook/useAxiosAuth";
import {
  AddSantriPayload,
  EditSantriPayload,
  GetDetailSantriResponse,
  GetSantriResponse,
} from "./interface";
import { useSession } from "next-auth/react";
import { ChangeEvent, useState } from "react";
import { SelectChangeEvent } from "@mui/material";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export interface FilterSantri {
  page: number;
  musrif_id: number | string;
  pageSize: number;
}

const defaultFilter: FilterSantri = {
  page: 1,
  pageSize: 10,
  musrif_id: ''
};
const useSantriModule = () => {
  const axiosAuthClient = useAxiosAuth();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const getSantri = async (params: FilterSantri): Promise<GetSantriResponse> =>
    await axiosAuthClient
      .get("/santri-halaqoh/list", { params })
      .then((res) => res.data);
  const getDetailSantri = async (
    id: string | number
  ): Promise<GetDetailSantriResponse> =>
    await axiosAuthClient
      .get(`/santri-halaqoh/detail/${id}`)
      .then((res) => res.data);

  const useGetSantri = () => {
    let [query, setQuery] = useState<FilterSantri>(defaultFilter);
    let [filterQuery, setFilterQuery] = useState<FilterSantri>(defaultFilter);
    console.log(filterQuery);
    const handlePage = (page: number) => {
      setFilterQuery((prev) => {
        return {
          ...prev,
          page: page,
        };
      });
      setQuery((prev) => ({ ...prev, page: page }));
    };
    const handlePageSize = (e: SelectChangeEvent<any>) => {
      setQuery((params) => ({ ...params, pageSize: e.target.value, page: 1 }));
      setFilterQuery((params) => ({
        ...params,
        pageSize: e.target.value,
        page: 1,
      }));
    };
    const { data, isLoading } = useQuery({
      queryKey: ["santri/list", [filterQuery]],
      queryFn: () => getSantri(filterQuery),
      enabled: !!session,
      refetchOnWindowFocus: false,
    });

    return {
      data,
      isLoading,
      query,
      setQuery,
      setFilterQuery,
      handlePage,
      handlePageSize,
    };
  };

  const useDetailSantri = (id: string | number) => {
    const { data, isLoading } = useQuery({
      queryKey: ["santri/detail", [id]],
      queryFn: () => getDetailSantri(id),
      enabled: !!session,
      refetchOnWindowFocus: false,
    });

    return { data, isLoading }
  };

  const useAddSantri = () => {
    const { mutate, isPending } = useMutation({
      mutationFn: async (payload: AddSantriPayload) =>
        await axiosAuthClient.post("/santri-halaqoh/create", payload),
      onSuccess(data, variables, context) {
        toast.success("create santri successfully");
        queryClient.invalidateQueries({
          queryKey: ["santri/list"],
        });
      },
      onError(error: AxiosError<any>, variables, context) {
        toast.error(error.response?.data.message);
      },
    });

    return { mutate, isPending };
  };
  const useEditSantri = (id: string | number) => {
    const { mutate, isPending } = useMutation({
      mutationFn: async (payload: EditSantriPayload) =>
        await axiosAuthClient.put(`/santri-halaqoh/update/${id}`, payload),
      onSuccess(data, variables, context) {
        toast.success("edit santri successfully");
        queryClient.invalidateQueries({
          queryKey: ["santri/list"],
        });
      },
      onError(error: AxiosError<any>, variables, context) {
        toast.error(error.response?.data.message);
      },
    });

    return { mutate, isPending };
  };

  const useDeleteSantri = () => {
    const { mutate, isPending } = useMutation({
      mutationFn: async (id: string) =>
        await axiosAuthClient.delete(`/santri-halaqoh/delete/${id}`),
      onSuccess(data, variables, context) {
        toast.success("delete santri successfully");
        queryClient.invalidateQueries({
          queryKey: ["santri/list"],
        });
      },
      onError(error: AxiosError<any>, variables, context) {
        toast.error(error.response?.data.message);
      },
    });

    return { mutate, isPending };
  };

  return {
    useGetSantri,
    useAddSantri,
    useDeleteSantri,
    useEditSantri,
    useDetailSantri
  };
};

export default useSantriModule;
