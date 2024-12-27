"use client";

import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import useSantriModule from "@/lib/santri";
import CustomFooter, { paginationOption } from "@/components/tableFooter";
import { DialogForm } from "@/components/dialogForm";
import { useAbsenSantriModule } from "@/lib/absen-santri";
import { AbsenSantriCard } from "@/components/absenSantriCard";
import { AbsenSantriData } from "@/lib/absen-santri/interface";
import useMusrifModule from "@/lib/musrif";
import { previousDay } from "date-fns";
import SelectInput from "@/components/selectInput";
import CustomPagination from "@/components/pagination";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs"; //

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", flex: 1 },
  { field: "nama_santri", headerName: "Nama Santri", flex: 3 },
  { field: "pengampu", headerName: "Pengampu", flex: 3 },
  // { field: "created_by", headerName: "Created By", flex: 3 },
  // { field: "updated_by", headerName: "Updated By", flex: 3 },
  // {
  //   field: "actions",
  //   headerName: "Actions",
  //   flex: 2,
  //   renderCell: (params) => (
  //     <div className="flex flex-row gap-3 items-center h-full">
  //       <Button
  //         variant="contained"
  //         color="primary"
  //         onClick={(event) => {
  //           event.stopPropagation();
  //         }}
  //       >
  //         Edit
  //       </Button>
  //     </div>
  //   ),
  // },
];
const musrifColumns: GridColDef[] = [
  { field: "number", headerName: "ID", flex: 1 },
  { field: "nama_musrif", headerName: "Nama musrif", flex: 3 },
  { field: "created_by", headerName: "Created By", flex: 3 },
];

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
  const [selected, setSelected] = React.useState<string>("");
  const [namaSantri, setNamaSantri] = React.useState<string>("");
  const [santriId, setSantriId] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<number>();
  const [inputValue, setInputValue] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const router = useRouter();
  const { useGetSantri } = useSantriModule();
  const {
    data,
    isLoading,
    query,
    setQuery,
    setFilterQuery,
    handlePage,
    handlePageSize,
  } = useGetSantri();

  React.useEffect(() => {
    setQuery((prev) => ({ ...prev, musrif_id: selected }));
    setFilterQuery((prev) => ({ ...prev, musrif_id: selected }));
  }, [selected, setFilterQuery, setQuery]);

  const { useGetAbsen, useAddAbsen } = useAbsenSantriModule();
  const {
    data: dataAbsen,
    isLoading: absenLoading,
    query: absenQuery,
    setQuery: setAbsenQuery,
    setFilterQuery: setAbsenFilterQuery,
    handlePage: handleAbsenPage,
    handlePageSize: handleAbsenPageSize,
    resetFilter: resetAbsenFilter
  } = useGetAbsen();

  React.useEffect(() => {
    setAbsenQuery((prev) => ({ ...prev, santri: santriId }));
    setAbsenFilterQuery((prev) => ({ ...prev, santri: santriId }));
  }, [santriId, setAbsenFilterQuery, setAbsenQuery]);

  const { useGetMusrif, useDeleteMusrif } = useMusrifModule();
  const {
    data: dataMusrif,
    isLoading: musrifLoading,
    query: musrifQuery,
    setQuery: setMusrifQuery,
    setFilterQuery: setMusrifFilterQuery,
    handlePage: handleMusrifPage,
    handlePageSize: handleMusrifPageSize,
  } = useGetMusrif();

  const { mutate, isPending } = useAddAbsen();

  const rows = React.useMemo(() => {
    return data?.data.map((row) => {
      return {
        id: row.id,
        nama_santri: row.nama_santri,
        pengampu: row.musrif ? row.musrif.nama_musrif : "-",
        created_by: row.created_by.nama,
        updated_by: row.updated_by == null ? null : row.updated_by.nama,
      };
    });
  }, [data]);
  const autoRows = React.useMemo(() => {
    return data?.data.map((row) => {
      return {
        id: row.id,
        nama_santri: row.nama_santri,
      };
    });
  }, [data]);

  const musrifRows = React.useMemo(() => {
    return dataMusrif?.data.map((row, index) => {
      return {
        number: index + 1,
        id: row.id,
        nama_musrif: row.nama_musrif,
        created_by: row.created_by.nama,
      };
    });
  }, [dataMusrif]);
  const handleBlur = () => {
    // Cek jika inputValue sama dengan nama_santri
    const foundSantri = autoRows?.find(
      (option) => option.nama_santri.toLowerCase() === inputValue.toLowerCase()
    );
    if (foundSantri) {
      setValue(foundSantri.id); // Set selectedSantri jika cocok
    }
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openButton = Boolean(anchorEl);
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = (tipe: "pagi" | "sore") => {
    mutate(tipe);
    setAnchorEl(null);
  };

  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(null);
  return (
    <div className="w-full p-5 flex flex-col bg-white">
      {/* <DialogForm open={open} handleClose={handleClose} handleSubmit={() => {}}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>Silahkan pilih santri yang ingin ditambahkan {value}</DialogContentText>
          <Autocomplete
            disablePortal
            onChange={(event: any, newValue) => {
              setValue(newValue?.id);
            }}
            options={autoRows as { id: number; nama_santri: string }[]}
            getOptionLabel={(option) => option.nama_santri}
            isOptionEqualToValue={(option, value) =>
              option.nama_santri === value.nama_santri
            }
            // onInputChange={(event, newInputValue) => {
            //   setInputValue(newInputValue);

            //   setValue(undefined);
            // }}
            // onBlur={handleBlur}
            // inputValue={inputValue}
            // onClose={handleClose}
            loading={isLoading}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Santri" className="mt-5"/>}
          />
        </DialogContent>
      </DialogForm> */}
      <div className="">
        <h1 className="text-5xl font-montserrat font-medium my-3">
          List Santri Halaqoh
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
        <div className="flex flex-row gap-3">
          <Button
            variant="contained"
            color="success"
            onClick={handleMenuClick}
            aria-controls={openButton ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openButton ? "true" : undefined}
          >
            Tambah Absen Hari Ini
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openButton}
            onClose={() => setAnchorEl(null)}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              onClick={() => handleMenuClose("pagi")}
              // sx={{ color: "blue" }}
              // color="success"
            >
              <Button variant="contained" color="success">
                Pagi
              </Button>
            </MenuItem>
            <MenuItem
              onClick={() => handleMenuClose("sore")}
              // sx={{ color: "orange" }}
              // color="success"
            >
              <Button variant="contained" color="warning">
                Sore
              </Button>
            </MenuItem>
          </Menu>
          {selected !== "" && (
            <Button
              variant="contained"
              color="error"
              onClick={() => setSelected("")}
            >
              Clear Filter
            </Button>
          )}
        </div>
      </div>
      <div className="mt-3 flex flex-row w-full gap-5 mb-5">
        <div className="flex-1">
          <Paper sx={{ width: "100%" }}>
            <DataGrid
              rows={musrifRows}
              key={(musrifRows?.length as number) < 1 ? 1 : musrifRows?.length}
              rowCount={musrifRows?.length}
              loading={musrifLoading}
              columns={musrifColumns}
              // initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              // checkboxSelection
              sx={{ border: 1, borderColor: "rgb(229 231 235 / 1)" }}
              onRowSelectionModelChange={(value, detail) => {
                setSelected(value[0].toString());
              }}
              slots={{
                footer: () => (
                  <CustomFooter
                    onPageChange={handleMusrifPage}
                    page={musrifQuery.page}
                    pageSize={musrifQuery.pageSize}
                    total={dataMusrif?.pagination.total as number}
                    onPageSizeChange={handleMusrifPageSize}
                  />
                ), // Mengganti komponen footer dengan custom footer
              }}
            />
          </Paper>
        </div>
        <div className="flex-1">
          {/* <div className="w-full flex flex-col gap-3">
            {dataAbsen?.data.length == 0 && (
              <div className="w-full h-32 border border-gray-500 rounded-md border-dashed flex items-center justify-center">
                <p className="text-gray-500">belum ada setoran</p>
              </div>
            )}
            {dataAbsen?.data.map((data, i) => (
              <AbsenSantriCard data={data} key={i} />
            ))}
          </div> */}
          <Paper sx={{ width: "100%" }}>
            <DataGrid
              rows={rows}
              key={(rows?.length as number) < 1 ? 1 : rows?.length}
              rowCount={rows?.length}
              loading={isLoading}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              // checkboxSelection
              sx={{ border: 1, borderColor: "rgb(229 231 235 / 1)" }}
              onRowSelectionModelChange={(value, detail) => {
                console.log(detail.api.getCellValue(value[0], "nama_santri"));
                const nama = detail.api.getCellValue(value[0], "nama_santri");
                setNamaSantri(nama);
                setSantriId(value[0].toString());
                // setSelected((prev) => [...prev, value]);
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
        </div>
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
      <Divider />
      <div className="flex w-full flex-col mt-5 ">
        <div className="w-full flex flex-row justify-between">
          <h1 className="text-3xl font-montserrat font-medium  ">
            Absen Santri : {namaSantri == "" ? "All Santri" : namaSantri}
          </h1>
          <div className="flex flex-row items-center gap-5  ">
            
            
            {(absenQuery.santri != "" || absenQuery.created_at != "") &&  (
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  setSantriId("");
                  setNamaSantri("");
                  setSelectedDate(null)
                  resetAbsenFilter()
                }}
              >
                See All Absen
              </Button>
            )}
            {/* {
              selectedDate != null && absenQuery.created_at != selectedDate.format("YYYY-MM-DD") && (
                <Button variant="contained" color="primary" onClick={() => {
                  setAbsenQuery((prev) => ({...prev, created_at:selectedDate.format("YYYY-MM-DD") }))
                  setAbsenFilterQuery((prev) => ({...prev, created_at:selectedDate.format("YYYY-MM-DD") }))
                }}>
                  filter
                </Button>
              )
            } */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
              
                label={"select date"}
                value={selectedDate}
                onChange={(newValue: Dayjs | null) => {
                  setAbsenQuery((prev) => ({...prev, created_at:newValue != null ? newValue.format("YYYY-MM-DD") : "" }))
                  setAbsenFilterQuery((prev) => ({...prev, created_at:newValue != null ? newValue.format("YYYY-MM-DD") : "" }))
                  setSelectedDate(newValue)
                }}
              />
            </LocalizationProvider>
            <p>{absenQuery.created_at}</p>
          </div>
        </div>
        <div className="w-full grid grid-cols-3 gap-3 mt-3">
          {dataAbsen?.data.length == 0 && (
            <div className="w-full h-32 col-span-3 border border-gray-500 rounded-md border-dashed flex items-center justify-center">
              <p className="text-gray-500">belum ada setoran</p>
            </div>
          )}
          {dataAbsen?.data.map((data, i) => (
            <AbsenSantriCard data={data} key={i} />
          ))}
          {absenLoading && (
            <div className="w-full h-32 col-span-3 border border-gray-500 rounded-md border-dashed flex items-center justify-center">
              <span className="loading loading-spinner"></span>
            </div>
          )}
        </div>
        <div className="flex w-full flex-row justify-between mt-5">
          <div className=" w-32 mr-5">
            <SelectInput
              sm
              id="pageSize"
              fullWidth
              name="pageSize"
              handleChange={handleAbsenPageSize}
              value={absenQuery.pageSize}
              option={paginationOption}
              label="Page Size"
            />
          </div>
          <CustomPagination
            page={absenQuery.page}
            pageSize={absenQuery.pageSize}
            total={dataAbsen?.pagination.total as number}
            onPageChange={handleAbsenPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
