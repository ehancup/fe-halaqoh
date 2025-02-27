import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import NextAuthProvider from "@/components/nextauth";
import ReactQuery from "@/components/reactQuery";
import { ReactNode } from "react";
import { Session } from "next-auth";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

interface NextAuthProps {
  children: ReactNode;
  session?: Session | null | undefined;
}

export default function RootLayout({ children, session }: Partial<NextAuthProps>) {
  return (
    <html lang="en" data-theme="light">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider session={session}>
          <ReactQuery>{children}</ReactQuery>
        </NextAuthProvider>
        <Toaster
          position="top-center"
          // toastOptions={{
          //   className: 'top-10',
          //   style: {
          //     top: '100px'
          //   }
          // }}
          toastOptions={{
            duration: 1500,
          }}
          containerStyle={{
            top: 80,
            zIndex: 999999999,
          }}
          reverseOrder={false}
        />
      </body>
    </html>
  );
}
