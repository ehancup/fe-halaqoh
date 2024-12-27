import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "../hook/useAxiosAuth";
import { GetAbsenMusrifResponse } from "./interface";
import { useState } from "react";
import { SelectChangeEvent } from "@mui/material";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import {AxiosError} from 'axios'

export interface FilterAbsenMusrif {
  page: number;
  pageSize: number;
}

const defaultFilter: FilterAbsenMusrif = {
  page: 1,
  pageSize: 10,
};
export const useAbsenMusrifModule = () => {
  const axiosAuthClient = useAxiosAuth();
  const queryClient = useQueryClient();
  const {data: session} = useSession()

  const getAbsen = async (
    params: FilterAbsenMusrif
  ): Promise<GetAbsenMusrifResponse> =>
    await axiosAuthClient
      .get("/absensi-musrif/list", { params })
      .then((res) => res.data);
  const useGetAbsen = () => {
    let [query, setQuery] = useState<FilterAbsenMusrif>(defaultFilter);
    let [filterQuery, setFilterQuery] =
      useState<FilterAbsenMusrif>(defaultFilter);
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
      queryKey: ["absen-musrif/list", [filterQuery]],
      queryFn: () => getAbsen(filterQuery),
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

  const useAbsenMusrif = () => {
    const {mutate, isPending} = useMutation({
      mutationFn: async () => await axiosAuthClient.post('/absensi-musrif/masuk', {nama : session?.user.nama, hadir: true, shift: "pagi", action: "masuk"}),
      onSuccess(data, variables, context) {
        toast.success("absent successfully");
        queryClient.invalidateQueries({
          queryKey: ["absen-musrif/list"],
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
    useAbsenMusrif
  }
};
