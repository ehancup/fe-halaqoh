import { useAbsenSantriModule } from "@/lib/absen-santri";
import {
  AbsenSantriData,
  AbsenSantriPayload,
} from "@/lib/absen-santri/interface";
import { formatDate } from "@/utils/data.utils";
import { TrashIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { Form, FormikProvider, getIn, useFormik } from "formik";
import React from "react";
import * as yup from "yup";
import InputText from "./inputText";
import SelectInput from "./selectInput";
import LoadingButton from "@mui/lab/LoadingButton";
import clsx from "clsx";

interface AbsenSantriCardProps {
  data: AbsenSantriData;
}

const editSetoranSchema = yup.object().shape({
  dariSurat: yup.string().required().default(""),
  sampaiSurat: yup.string().required().default(""),
  dariAyat: yup.number().required().default(null),
  sampaiAyat: yup.number().required().default(null),
  status: yup
    .mixed()
    .oneOf(["HADIR", "TIDAK_HADIR", "IZIN", "SAKIT", "ALPHA"])
    .required()
    .default("TIDAK_HADIR"),
  keterangan: yup.string().required().default(""),
});

export const AbsenSantriCard = ({ data }: AbsenSantriCardProps) => {
  const [detail, setDetail] = React.useState<AbsenSantriData>();
  const [formikValue, setFormikValue] = React.useState<AbsenSantriPayload>({
    dariSurat: "",
    dariAyat: null,
    sampaiSurat: "",
    sampaiAyat: null,
    status: "TIDAK_HADIR",
    keterangan: "",
  });
  const { useDeleteAbsen, useDetailAbsenWithMutate, useUpdateAbsen } =
    useAbsenSantriModule();
  const { mutate: getDetail, isPending: detailLoad } =
    useDetailAbsenWithMutate();
  const { mutate, isPending } = useDeleteAbsen();
  const { mutate: update, isPending: updateLoad } = useUpdateAbsen(data.id);

  const [open, setOpen] = React.useState(false);
  const [formOpen, setFormOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleFormOpen = () => {
    getDetail(data.id, {
      onSuccess(data, variables, context) {
        setDetail(data.data);
        setFormikValue({
          dariSurat: data.data.dariSurat || "",
          dariAyat: data.data.dariAyat || null,
          sampaiSurat: data.data.sampaiSurat || "",
          sampaiAyat: data.data.sampaiAyat || null,
          status: data.data.status as
            | "HADIR"
            | "TIDAK_HADIR"
            | "IZIN"
            | "SAKIT"
            | "ALPHA",
          keterangan: data.data.keterangan || "",
        });
        setFormOpen(true);
      },
    });
  };

  const handleYesClose = () => {
    mutate(data.id);
    setOpen(false);
  };
  const handleNoClose = () => {
    setOpen(false);
  };
  const handleFormClose = () => {
    setFormOpen(false);
  };

  const formik = useFormik<AbsenSantriPayload>({
    initialValues: formikValue,
    validationSchema: editSetoranSchema,
    enableReinitialize: true,
    onSubmit: (value: AbsenSantriPayload) => {
      console.log(value);
      update(value, {
        onSuccess(data, variables, context) {
          setFormOpen(false);
        },
      });
    },
  });

  const { values, errors, handleChange, handleBlur, handleSubmit } = formik;

  const option = [
    { label: "hadir", value: "HADIR" },
    { label: "tidak hadir", value: "TIDAK_HADIR" },
    { label: "izin", value: "IZIN" },
    { label: "sakit", value: "SAKIT" },
    { label: "alpha", value: "ALPHA" },
  ];

  return (
    <div className="w-full flex flex-col rounded shadow overflow-hidden">
      <div
        className={clsx("w-full p-2 grid place-items-center", {
          "bg-green-500/10": data.tipe == "pagi",
          "bg-orange-500/10": data.tipe == "sore",
        })}
      >
        <span
          className={clsx("font-bold", {
            "text-green-800": data.tipe == "pagi",
            "text-orange-600": data.tipe == "sore",
          })}
        >
          {data.tipe.toLocaleUpperCase()}
        </span>
      </div>
      <div className="w-full p-5 flex flex-col">
        <div className="flex flex-row justify-between w-full">
          <div className="">
            <p className="text-gray-400 text-sm italic">
              {formatDate(data.created_at, { format: "day" })}
            </p>
            <p className="mt-3">
              <span className="font-bold">Nama : </span>
              {data.santri.nama_santri}
            </p>
            <p className="">
              <span className="font-bold">Kelas : </span>
              {data.santri.kelas}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <IconButton
              color="error"
              onClick={() => {
                handleClickOpen();
              }}
            >
              <TrashIcon className="h-5 w-5" />
            </IconButton>
            <p className="mt-5">
              <span className="font-bold">Musrif : </span>
              {data.namaMusrif}
            </p>
          </div>
        </div>
        {data.dariSurat == null && data.dariAyat == null ? (
          <div className="w-full h-20 flex justify-center relative items-center rounded border overflow-hidden border-gray-300 mt-5 cursor-pointer group/sc">
            <p className="text-black text-opacity-75 group-hover/sc:text-opacity-0 transition-all duration-150">
              {!detailLoad ? (
                <span className="">belum setoran</span>
              ) : (
                <span className="loading loading-spinner"></span>
              )}
            </p>
            <div
              className="absolute w-full h-full inset-0 flex items-center justify-center bg-black/65 opacity-0 group-hover/sc:opacity-100 transition-all duration-150"
              onClick={handleFormOpen}
            >
              <p className="text-white">tambah setoran</p>
            </div>
          </div>
        ) : (
          <div className="w-full mt-5 flex flex-row justify-between rounded gap-3 relative group/sc">
            <div className="flex flex-col items-start flex-1 bg-green-500/10 rounded-xl overflow-hidden">
              <p className="w-full bg-green-700 grid place-items-center text-white font-medium">Dari</p>
              <div className="p-2">
                <p className="font-bold italic">{data.dariSurat}</p>
                <p className="text-sm">Ayat - {data.dariAyat}</p>
              </div>
            </div>
            {/* <div className="self-center">
              <p>{"-->"}</p>
            </div> */}
            <div className="flex flex-col items-start flex-1 bg-orange-500/10 rounded-xl overflow-hidden">
              <p className="w-full bg-orange-600 grid place-items-center text-white font-medium">Sampai</p>
              <div className="p-2">
                <p className="font-bold italic">{data.sampaiSurat}</p>
                <p className="text-sm">Ayat - {data.sampaiAyat}</p>
              </div>
            </div>
            <div
              className="absolute w-full h-full inset-0 flex items-center justify-center rounded-xl bg-black/65 opacity-0 group-hover/sc:opacity-100 transition-all duration-150"
              onClick={handleFormOpen}
            >
              <p className="text-white">edit setoran</p>
            </div>
          </div>
        )}
        <Dialog
          open={open}
          onClose={handleNoClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Yakin ingin menghapus data terpilih?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Data yang dihapus tidak dapat dikembalikan lagi.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleNoClose} color="error">
              Tidak
            </Button>
            <Button onClick={handleYesClose} autoFocus>
              Ya
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={formOpen}
          onClose={handleFormClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Edit Setoran"}</DialogTitle>
          <DialogContent>
            <FormikProvider value={formik}>
              <Form onSubmit={handleSubmit} className="mt-3 flex flex-col  ">
                <div className="flex flex-row items-center gap-5">
                  <div className="flex flex-col gap-3">
                    <InputText
                      id="dariSurat"
                      name="dariSurat"
                      onChange={handleChange}
                      // disabled={isPending}
                      onBlur={handleBlur}
                      isRequired
                      label="dari surat"
                      isError={getIn(errors, "dariSurat")}
                      messageError={getIn(errors, "dariSurat")}
                      value={values.dariSurat}
                    />
                    <InputText
                      id="dariAyat"
                      name="dariAyat"
                      onChange={handleChange}
                      // disabled={isPending}
                      onBlur={handleBlur}
                      isRequired
                      label="dari ayat"
                      isError={getIn(errors, "dariAyat")}
                      messageError={getIn(errors, "dariAyat")}
                      value={values.dariAyat}
                    />
                  </div>
                  <div className="">{"-->"}</div>
                  <div className="flex flex-col gap-3">
                    <InputText
                      id="sampaiSurat"
                      name="sampaiSurat"
                      onChange={handleChange}
                      // disabled={isPending}
                      onBlur={handleBlur}
                      isRequired
                      label="sampai surat"
                      isError={getIn(errors, "sampaiSurat")}
                      messageError={getIn(errors, "sampaiSurat")}
                      value={values.sampaiSurat}
                    />
                    <InputText
                      id="sampaiAyat"
                      name="sampaiAyat"
                      onChange={handleChange}
                      // disabled={isPending}
                      onBlur={handleBlur}
                      isRequired
                      label="sampai ayat"
                      isError={getIn(errors, "sampaiAyat")}
                      messageError={getIn(errors, "sampaiAyat")}
                      value={values.sampaiAyat}
                    />
                  </div>
                </div>
                <div className="flex flex-row gap-3 mt-3">
                  <SelectInput
                    id="status"
                    option={option}
                    name="status"
                    handleChange={handleChange}
                    onBlur={handleBlur}
                    isRequired
                    label="status"
                    isError={getIn(errors, "status")}
                    messageError={getIn(errors, "status")}
                    value={values.status}
                  />
                  <div className="flex-1">
                    <InputText
                      id="keterangan"
                      fullWidth
                      name="keterangan"
                      onChange={handleChange}
                      // disabled={isPending}
                      onBlur={handleBlur}
                      isRequired
                      label="keterangan"
                      isError={getIn(errors, "keterangan")}
                      messageError={getIn(errors, "keterangan")}
                      value={values.keterangan}
                    />
                  </div>
                </div>
              </Form>
              {/* <div className="">{JSON.stringify(formikValue)}</div> */}
            </FormikProvider>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={handleFormClose}>
              Cancel
            </Button>
            <LoadingButton
              loading={updateLoad}
              variant="contained"
              disabled={values === formikValue}
              onClick={() => handleSubmit()}
            >
              submit
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};
