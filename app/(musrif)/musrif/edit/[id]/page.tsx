"use client";

import InputText from "@/components/inputText";
import useMusrifModule from "@/lib/musrif";
import { AddMusrifPayload, EditMusrifPayload } from "@/lib/musrif/interface";
import useSantriModule from "@/lib/santri";
import LoadingButton from "@mui/lab/LoadingButton";
import { Button, Paper } from "@mui/material";
import { Form, FormikProvider, getIn, useFormik } from "formik";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as yup from "yup";

const addSantriSchema = yup.object().shape({
  nama_musrif: yup.string().required().default(""),

});

const Page = () => {
    const router = useRouter()
    const { id } = useParams<{ id: string }>();
    const {useEditMusrif, useDetailMusrif} = useMusrifModule();
    const {data, isLoading} = useDetailMusrif(id)
    const {mutate, isPending} = useEditMusrif(id);

  const formik = useFormik<EditMusrifPayload>({
    initialValues: {
        nama_musrif: data?.data.nama_musrif || ""
    },
    validationSchema: addSantriSchema,
    enableReinitialize: true,
    onSubmit: (value: EditMusrifPayload) => {
        console.log(value);
        mutate(value, {
          onSuccess(data, variables, context) {
            router.push('/musrif');
          },
        });
    },
  });

  const { values, errors, handleChange, handleBlur, handleSubmit } = formik;
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Paper className="p-5 flex flex-col w-96 " elevation={2}>
        <Button color="error" variant="contained" size="small" className="self-start mb-5" onClick={() => {
            router.push('/musrif')
        }}>back</Button>
        <h1 className="font-montserrat text-3xl text-center font-bold mb-5 self-start ">
          Edit musrif
        </h1>
        <FormikProvider value={formik}>
          <Form className="flex flex-col gap-3    " onSubmit={handleSubmit}>
            <InputText
              id="nama_musrif"
              name="nama_musrif"
              onChange={handleChange}
              // disabled={isPending}
              onBlur={handleBlur}
              isRequired
              label="Nama Musrif"
              isError={getIn(errors, "nama_musrif")}
              messageError={getIn(errors, "nama_musrif")}
              value={values.nama_musrif}
              fullWidth
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
