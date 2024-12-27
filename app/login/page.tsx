"use client";
import InputText from "@/components/inputText";
import { LoginPayload } from "@/lib/auth/interface";
import { Form, FormikProvider, getIn, useFormik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingButton from "@mui/lab/LoadingButton";
import * as yup from "yup";

import loginBg from "../../public/790.jpg";

import TextField from "@mui/material/TextField";
import { useAuthModule } from "@/lib/auth";

const loginSchema = yup.object().shape({
  email: yup.string().email().required().default(""),
  password: yup.string().required().default(""),
});

const Page = () => {
  const searchParam = useSearchParams();
  const { useLogin } = useAuthModule();
  const { mutate, isPending } = useLogin();
  const router = useRouter();
  const isCallback = searchParam.has("callbackUrl");
  const callbackUrl = searchParam.get("callbackUrl");
  console.log(callbackUrl);
  const formik = useFormik<LoginPayload>({
    initialValues: loginSchema.getDefault(),
    validationSchema: loginSchema,
    enableReinitialize: true,
    onSubmit: (value: LoginPayload) => {
      console.log(value);
      mutate(value, {
        onSuccess(data, variables, context) {
          router.replace(callbackUrl || "/");
        },
      });
    },
  });
  const { values, errors, handleChange, handleBlur, handleSubmit } = formik;
  return (
    <div className="w-full h-screen flex flex-row">
      <div className="w-[500px] bg-white h-full flex items-center justify-center px-6 sm:px-12">
        <div className="w-full flex-col  ">
          <h1 className="font-montserrat text-3xl text-center font-bold mb-5 ">
            Login
          </h1>
          <FormikProvider value={formik}>
            <Form className="flex flex-col gap-3    " onSubmit={handleSubmit}>
              <InputText
                id="email"
                name="email"
                onChange={handleChange}
                // disabled={isPending}
                onBlur={handleBlur}
                isRequired
                label="email"
                isError={getIn(errors, "email")}
                messageError={getIn(errors, "email")}
                value={values.email}
              />
              <InputText
                id="password"
                name="password"
                onChange={handleChange}
                // disabled={isPending}
                
                onBlur={handleBlur}
                isRequired
                protect
                label="password"
                isError={getIn(errors, "password")}
                messageError={getIn(errors, "password")}
                value={values.password}
              />
              {/* <Link
                href={"/forgot-password"}
                className="text-sm text-blue-500 underline"
              >
                {"forgot password"}
              </Link> */}

              {/* <button className="btn  w-full mt-4 font-medium" type="submit">
                {isPending ? (
                    <span className="loading loading-spinner loading-sm"></span>
                ) : "login"}
                Login
              </button> */}
              <LoadingButton
                color="success"
                loading={false}
                type="submit"
                loadingPosition="start"
                variant="contained"
                size="large"
              >
                Login
              </LoadingButton>
            </Form>
          </FormikProvider>

        </div>
      </div>

      <div
        className="flex-1 h-full bg-green-500"
        style={{
          backgroundImage: `url(${loginBg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center right",
        }}
      ></div>
    </div>
  );
};

export default Page;
