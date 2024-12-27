import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn, useSession } from "next-auth/react";
import { LoginPayload, LoginResponse } from "./interface";
import { AxiosResponse } from "axios";
import { axiosClient } from "../axios/axiosClient";
import toast from "react-hot-toast";

export const useAuthModule = () => {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    const useLogin = () => {
        const { mutate, isPending } = useMutation({
          mutationFn: (e: LoginPayload) => axiosClient.post("/auth/login", {...e, role: "musrif"}),
          async onSuccess(data: AxiosResponse<LoginResponse>, variables, context) {
            toast.success("login successful");
            console.log(data.data.data.email);
            await signIn("credentials", {
              ...data.data.data,
              redirect: false,
            });
          },
          onError(error: any, variables, context) {
            toast.error(error.response.data.message);
            toast.error("something went wrong");
            console.log(error);
          },
        });
        return { mutate, isPending };
      };

    return {
        useLogin
    }
}