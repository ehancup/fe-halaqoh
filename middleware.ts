import nextAuth from "next-auth";
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

// export {default} from 'next-auth/middleware'
export default withAuth(
  function middleware(req: any) {
    // const url = req?.nextUrl.pathname;
    // const role = req?.nextauth?.token?.role;
    // console.log(role);
    // console.log("middleware berjalan");
    // if (url.startsWith("/profile")) {
    //   console.log("apakek yg penting panjangg================================");
    //   console.log("request========");
    //   if (!['seller', 'user'].includes(role)) {
    //     return NextResponse.redirect(new URL("/", req.url));
    //     // return NextResponse.rewrite(new URL("/notaccess", req.url));
    //   } else {
    //     return NextResponse.next();
    //   }
    // }

    // if (/^\/seller(?:\/.*)?/ig.test(url)) {
    //   console.log('yes');
    //   if (!['seller'].includes(role)) {
    //     return NextResponse.redirect(new URL("/", req.url));
    //     // return NextResponse.rewrite(new URL("/notaccess", req.url));
    //   } else {
    //     return NextResponse.next();
    //   }
    // }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        if (token) return true;
        return false;
      },
    },
    pages: {
      signIn: "/login",
      error: "/login",
    },
  }
);

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)'], // Proteksi semua route kecuali api dan file statis
  };
