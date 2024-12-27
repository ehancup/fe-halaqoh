"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import log from "../lib/logger/loggerClient";
import { useEffect } from "react";
import {
  Alert,
  Button,
  AlertTitle,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useAbsenMusrifModule } from "@/lib/absen-musrif";
import { formatDate } from "@/utils/data.utils";
import SelectInput from "@/components/selectInput";
import CustomPagination from "@/components/pagination";

const option = [
  { label: "1", value: 1 },
  { label: "10", value: 10 },
  { label: "15", value: 15 },
  { label: "25", value: 25 },
];

export default function Home() {
  const { data: session } = useSession();
  useEffect(() => {
    console.log("session", session);
  }, [session]);
  const { useGetAbsen, useAbsenMusrif } = useAbsenMusrifModule();
  const {mutate, isPending} = useAbsenMusrif()

  const {
    data,
    isLoading,
    query,
    setQuery,
    setFilterQuery,
    handlePage,
    handlePageSize,
  } = useGetAbsen();
  return (
    <div className="min-h-screen w-full bg-white flex flex-col p-5">
      <Alert
        severity="error"
        action={
          <Button color="error" size="small" variant="contained" onClick={() => mutate()} disabled={isPending}>
            Absen
          </Button>
        }
        onClose={() => {}}
      >
        <AlertTitle>Belum Absen !</AlertTitle>
        Silahkan tekan tombol diseblah untuk absen!
      </Alert>
      <div className="w-full grid grid-cols-2 gap-5 mt-10">
        <div className=" flex flex-col gap-3">
          <h1 className="font-medium font-montserrat text-3xl ">
            Data Kehadiran
          </h1>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>id</TableCell>
                  <TableCell align="right">Status</TableCell>
                  <TableCell align="right">Shift</TableCell>
                  <TableCell align="right">Tanggal Masuk</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell align="right">
                      {row.hadir ? "hadir" : "absen"}
                    </TableCell>
                    <TableCell align="right">{row.shift}</TableCell>
                    <TableCell align="right">
                      {formatDate(row.tanggal_masuk)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="flex flex-row w-full justify-between items-center mt-2">
            <div className=" w-32 mr-5">
              <SelectInput
                sm
                id="pageSize"
                name="pageSize"
                handleChange={handlePageSize}
                value={query.pageSize}
                option={option}
                label="Page Size"
              />
            </div>
            <CustomPagination
              page={query.page}
              pageSize={query.pageSize}
              total={data?.pagination.total as number}
              onPageChange={handlePage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
