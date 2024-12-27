"use client";

import InputText from "@/components/inputText";
import SelectInput from "@/components/selectInput";
import useMusrifModule from "@/lib/musrif";
import useSantriModule from "@/lib/santri";
import { AddSantriPayload } from "@/lib/santri/interface";
import LoadingButton from "@mui/lab/LoadingButton";
import { Button, Paper, SelectChangeEvent } from "@mui/material";
import { Form, FormikProvider, getIn, useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import * as yup from "yup";

const addSantriSchema = yup.object().shape({
  nama_santri: yup.string().required().default(""),
  musrif_id: yup.number().required().default(null),
  kelas: yup.number().required().default(null),
});

const Page = () => {
  const router = useRouter();
  const { useAddSantri } = useSantriModule();
  const { useGetMusrif } = useMusrifModule();
  const {
    data,
    isLoading,
    query,
    setQuery,
    setFilterQuery,
    handlePage,
    handlePageSize,
  } = useGetMusrif();
  const option = useMemo(() => {
    const p = data?.data.map((row, index) => {
      return {
        label: row.nama_musrif,
        value: row.id,
      };
    });

    return isLoading ? [] : p;
  }, [data, isLoading]);
  const { mutate, isPending } = useAddSantri();
  const formik = useFormik<AddSantriPayload>({
    initialValues: addSantriSchema.getDefault(),
    validationSchema: addSantriSchema,
    enableReinitialize: true,
    onSubmit: (value: AddSantriPayload) => {
      console.log(value);
      mutate(value, {
        onSuccess(data, variables, context) {
          router.push("/santri");
        },
      });
    },
  });

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = formik;

  const handleMusrifChange = (e: SelectChangeEvent<any>) => {
    setFieldValue("musrif_id", e.target.value);
  };
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Paper className="p-5 flex flex-col w-96 " elevation={2}>
        <Button
          color="error"
          variant="contained"
          size="small"
          className="self-start mb-5"
          onClick={() => {
            router.push("/santri");
          }}
        >
          back
        </Button>
        <h1 className="font-montserrat text-3xl text-center font-bold mb-5 self-start ">
          Tambah Santri
        </h1>
        <FormikProvider value={formik}>
          <Form className="flex flex-col gap-3    " onSubmit={handleSubmit}>
            <InputText
              id="nama_santri"
              name="nama_santri"
              onChange={handleChange}
              // disabled={isPending}
              onBlur={handleBlur}
              isRequired
              label="Nama Santri"
              isError={getIn(errors, "nama_santri")}
              messageError={getIn(errors, "nama_santri")}
              value={values.nama_santri}
              fullWidth
            />
            <InputText
              id="kelas"
              name="kelas"
              onChange={handleChange}
              // disabled={isPending}
              onBlur={handleBlur}
              isRequired
              label="Kelas"
              isError={getIn(errors, "kelas")}
              messageError={getIn(errors, "kelas")}
              value={values.kelas}
              fullWidth
            />
            <SelectInput
              id="musrif_id"
              fullWidth
              name="musrif_id"
              handleChange={handleMusrifChange}
              value={values.musrif_id as number}
              option={option}
              isError={getIn(errors, "musrif_id")}
              messageError={getIn(errors, "musrif_id")}
              label="Musrif"
            />

            {/* <button className="btn  w-full mt-4 font-medium" type="submit">
                {isPending ? (
                    <span className="loading loading-spinner loading-sm"></span>
                ) : "login"}
                Login
              </button> */}
            <LoadingButton
              color="success"
              loading={isPending}
              type="submit"
              loadingPosition="start"
              variant="contained"
              size="large"
              fullWidth
            >
              Submit
            </LoadingButton>
          </Form>
        </FormikProvider>
      </Paper>
    </div>
  );
};

export default Page;
