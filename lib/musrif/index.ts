import { useSession } from "next-auth/react";
import useAxiosAuth from "../hook/useAxiosAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddMusrifPayload, EditMusrifPayload, GetDetailMusrifResponse, GetMusrifResponse } from "./interface";
import { useState } from "react";
import { SelectChangeEvent } from "@mui/material";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export interface FilterMusrif {
  page: number;
  pageSize: number;
}

const defaultFilter: FilterMusrif = {
  page: 1,
  pageSize: 10,
};

const useMusrifModule = () => {
  const axiosAuthClient = useAxiosAuth();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const getMusrif = async (params: FilterMusrif): Promise<GetMusrifResponse> =>
    await axiosAuthClient
      .get("/musrif/list", { params })
      .then((res) => res.data);
  const getDetailMusrif = async (id: string| number): Promise<GetDetailMusrifResponse> =>
    await axiosAuthClient
      .get(`/musrif/detail/${id}`, )
      .then((res) => res.data);

  const useGetMusrif = () => {
    let [query, setQuery] = useState<FilterMusrif>(defaultFilter);
    let [filterQuery, setFilterQuery] = useState<FilterMusrif>(defaultFilter);
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
      queryKey: ["musrif/list", [filterQuery]],
      queryFn: () => getMusrif(filterQuery),
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

  const useDetailMusrif = (id: string| number) => {
    const { data, isLoading } = useQuery({
      queryKey: ["musrif/detail", [id]],
      queryFn: () => getDetailMusrif(id),
      enabled: !!session,
      refetchOnWindowFocus: false,
    })

    return { data, isLoading }
  }
  const useAddMusrif = () => {
    const { mutate, isPending } = useMutation({
      mutationFn: async (payload: AddMusrifPayload) =>
        await axiosAuthClient.post("/musrif/create", payload),
      onSuccess(data, variables, context) {
        toast.success("create musrif successfully");
        queryClient.invalidateQueries({
          queryKey: ["musrif/list"],
        });
      },
      onError(error: AxiosError<any>, variables, context) {
        toast.error(error.response?.data.message);
      },
    });

    return {mutate, isPending}
  };
  const useEditMusrif = (id: string | number) => {
    const { mutate, isPending } = useMutation({
      mutationFn: async (payload: EditMusrifPayload) =>
        await axiosAuthClient.put(`/musrif/update/${id}`, payload),
      onSuccess(data, variables, context) {
        toast.success("edit musrif successfully");
        queryClient.invalidateQueries({
          queryKey: ["musrif/list"],
        });
      },
      onError(error: AxiosError<any>, variables, context) {
        toast.error(error.response?.data.message);
      },
    });

    return {mutate, isPending}
  };
  const useDeleteMusrif = () => {
    const { mutate, isPending } = useMutation({
      mutationFn: async (id: number | string) =>
        await axiosAuthClient.delete(`/musrif/delete/${id}`),
      onSuccess(data, variables, context) {
        toast.success("delete musrif successfully");
        queryClient.invalidateQueries({
          queryKey: ["musrif/list"],
        });
      },
      onError(error: AxiosError<any>, variables, context) {
        toast.error(error.response?.data.message);
      },
    });

    return {mutate, isPending}
  };

  return { useGetMusrif, useAddMusrif, useDeleteMusrif, useDetailMusrif, useEditMusrif };
};

export default useMusrifModule;
