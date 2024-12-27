import { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: any;
      email: string | undefined | null;
      nama: any;
      role: any;
      accessToken: any;
      refreshToken: any;
      token: any;
    };
  }
}
