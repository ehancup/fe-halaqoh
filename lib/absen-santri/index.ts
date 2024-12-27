import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "../hook/useAxiosAuth";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { SelectChangeEvent } from "@mui/material";
import {
  AbsenSantriPayload,
  GetAbsenSantriResnponse,
  GetDetailAbsenSantriResnponse,
} from "./interface";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export interface FilterAbsenSantri {
  page: number;
  pageSize: number;
  santri: number | string;
  created_at: string;
}

const defaultFilter: FilterAbsenSantri = {
  page: 1,
  pageSize: 10,
  santri: '',
  created_at: ''
};

export const useAbsenSantriModule = () => {
  const axiosAuthClient = useAxiosAuth();
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const getAbsentSantriList = async (
    params: FilterAbsenSantri
  ): Promise<GetAbsenSantriResnponse> =>
    await axiosAuthClient
      .get("/absen-santri/list", { params })
      .then((res) => res.data);

  const useGetAbsen = () => {
    let [query, setQuery] = useState<FilterAbsenSantri>(defaultFilter);
    let [filterQuery, setFilterQuery] =
      useState<FilterAbsenSantri>(defaultFilter);
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
    const resetFilter = () => {
      setFilterQuery(defaultFilter)
      setQuery(defaultFilter)
    }

    const { data, isLoading } = useQuery({
      queryKey: ["absen-santri/list", [filterQuery]],
      queryFn: () => getAbsentSantriList(filterQuery),
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
      resetFilter
    };
  };

  const useDeleteAbsen = () => {
    const { mutate, isPending } = useMutation({
      mutationFn: async (id: string | number) =>
        await axiosAuthClient.delete(`/absen-santri/delete/${id}`),
      onSuccess(data, variables, context) {
        toast.success("absent deleted successfully");
        queryClient.invalidateQueries({
          queryKey: ["absen-santri/list"],
        });
      },
      onError(error: AxiosError<any>, variables, context) {
        toast.error(error.response?.data.message);
      },
    });

    return { mutate, isPending };
  };
  const useAddAbsen = () => {
    const { mutate, isPending } = useMutation({
      mutationFn: async (tipe: "pagi" | "sore") =>
        await axiosAuthClient.post(`/absen-santri/create`, {tipe}),
      onSuccess(data, variables, context) {
        toast.success(`absent ${variables} created successfully`);
        queryClient.invalidateQueries({
          queryKey: ["absen-santri/list"],
        });
      },
      onError(error: AxiosError<any>, variables, context) {
        toast.error(error.response?.data.message);
      },
    });

    return { mutate, isPending };
  };

  const useDetailAbsenWithMutate = () => {
    const { mutate, isPending } = useMutation({
      mutationFn: async (
        id: string | number
      ): Promise<GetDetailAbsenSantriResnponse> =>
        await axiosAuthClient
          .get(`/absen-santri/find/${id}`)
          .then((res) => res.data),
      onSuccess(data, variables, context) {
        
      },
      onError(error: AxiosError<any>, variables, context) {
        toast.error(error.response?.data.message);
      },
    });

    return { mutate, isPending }
  };

  const useUpdateAbsen = (id: string | number) => {
    const {mutate, isPending} = useMutation({
      mutationFn: async (payload: AbsenSantriPayload) => await axiosAuthClient.put(`/absen-santri/update/${id}`, payload),
      onSuccess(data, variables, context) {
        toast.success("absent updated successfully");
        queryClient.invalidateQueries({
          queryKey: ["absen-santri/list"],
        });
      },
      onError(error: AxiosError<any>, variables, context) {
        toast.error(error.response?.data.message);
      },
    })

    return {mutate, isPending}
  }

  return {
    useGetAbsen,
    useDeleteAbsen,
    useAddAbsen,
    useDetailAbsenWithMutate,
    useUpdateAbsen
  };
};
