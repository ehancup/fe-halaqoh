"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import useSantriModule from "@/lib/santri";
import CustomFooter from "@/components/tableFooter";

// const rows = [
//   { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
//   { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
//   { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
//   { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
//   { id: 534545, lastName: "Targaryen", firstName: "Daenerys", age: null },
//   { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
//   { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
//   { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
//   { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
// ];

const paginationModel = { page: 0, pageSize: 5 };

const Page = () => {
  const [selected, setSelected] = React.useState<any[]>([]);
  const router = useRouter();
  const [id, setId] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);

  const { useGetSantri, useDeleteSantri } = useSantriModule();
  const {
    data,
    isLoading,
    query,
    setQuery,
    setFilterQuery,
    handlePage,
    handlePageSize,
  } = useGetSantri();
  const rows = React.useMemo(() => {
    return data?.data.map((row, index) => {
      return {
        number: index + 1,
        id: row.id,
        nama_santri: row.nama_santri,
        pengampu: row.musrif ? row.musrif.nama_musrif : "-",
        created_by: row.created_by.nama,
        updated_by: row.updated_by == null ? null : row.updated_by.nama,
      };
    });
  }, [data]);
  const noneRow = [
    {
      number: 1,
      id: 1,
      nama_santri: "tidak ada data",
    },
  ];

  const { mutate, isPending } = useDeleteSantri();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    mutate(id);
    setOpen(false);
  };

  const columns: GridColDef[] = [
    { field: "number", headerName: "ID", flex: 1 },
    { field: "nama_santri", headerName: "Nama Santri", flex: 3 },
    { field: "pengampu", headerName: "Pengampu", flex: 3 },
    { field: "created_by", headerName: "Created By", flex: 3 },
    { field: "updated_by", headerName: "Updated By", flex: 3 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 3,
      renderCell: (params) => {
        if (params.row.nama_santri === "tidak ada data" && params.row.id == 1)
          return null;
        return (
          <div className="flex flex-row gap-0 items-center h-full">
            <IconButton
              color="primary"
              onClick={(event) => {
                event.stopPropagation();
                router.push(`/santri/edit/${params.row.id}`);
              }}
            >
              <PencilIcon className="h-5 w-5" />
            </IconButton>
            <IconButton
              color="error"
              onClick={(event) => {
                event.stopPropagation();
                setId(params.row.id.toString());
                handleClickOpen();
              }}
            >
              <TrashIcon className="h-5 w-5" />
            </IconButton>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full p-5 flex flex-col bg-white">
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Apa anda yakin ingin menghapus data?"}
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleClose}>Tidak</Button>
          <Button
            onClick={handleClose}
            autoFocus
            color="error"
            disabled={id == ""}
          >
            Ya
          </Button>
        </DialogActions>
      </Dialog>
      <div className="">
        <h1 className="text-5xl font-montserrat font-medium my-3">
          List Santri
        </h1>
      </div>
      <Divider />
      <div className="flex flex-row mt-6 justify-between">
        {/* <div className="">
          <FormControl variant="standard">
            <Input
              id="search"
              startAdornment={
                <InputAdornment position="start">
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </InputAdornment>
              }
              placeholder="Cari Santri..."
              color="success"
            />
          </FormControl>
        </div> */}
        <div className="">
          <Button
            variant="contained"
            color="success"
            onClick={() => router.push("/santri/tambah")}
          >
            Tambah Santri
          </Button>
        </div>
      </div>
      <div className="mt-3">
        <Paper sx={{ width: "100%" }}>
          <DataGrid
            rows={(rows?.length as number) < 1 ? noneRow : rows}
            key={(rows?.length as number) < 1 ? 1 : rows?.length}
            loading={isLoading}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            sx={{ border: 1, borderColor: "rgb(229 231 235 / 1)" }}
            onRowSelectionModelChange={(value, detail) => {
              console.log(value);
              setSelected((prev) => [...prev, value]);
            }}
            slots={{
              footer: () => (
                <CustomFooter
                  onPageChange={handlePage}
                  page={query.page}
                  pageSize={query.pageSize}
                  total={data?.pagination.total as number}
                  onPageSizeChange={handlePageSize}
                />
              ), // Mengganti komponen footer dengan custom footer
            }}
          />
        </Paper>
        {/* <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>id</TableCell>
                <TableCell align="right">Calories</TableCell>
                <TableCell align="right">Fat&nbsp;(g)</TableCell>
                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                <TableCell align="right">Protein&nbsp;(g)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell align="right">{row.firstName}</TableCell>
                  <TableCell align="right">{row.lastName}</TableCell>
                  <TableCell align="right">{row.age}</TableCell>
                  <TableCell align="right">{row.lastName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer> */}
      </div>
      <div className="">
        <p>{JSON.stringify(selected)}</p>
      </div>
    </div>
  );
};

export default Page;
