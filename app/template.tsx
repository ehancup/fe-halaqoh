"use client";

import Navbar from "@/components/navbar";
import { InboxIcon, UserIcon, HomeIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

interface TemplateProps {
  children: ReactNode;
}

const Template = ({ children }: TemplateProps) => {
  const [draw, setDraw] = useState<boolean>(false);
  const { data: session } = useSession();
  const router = useRouter();
  const pathName = usePathname();
  const spesificRoute = /^\/(login?)$/;
  //   const spesificRoute =
  //     /^\/(login|forgot-password|sent|reset-password(?:\/.*)|register|seller(?:\/.*)?)$/;
  return !spesificRoute.test(pathName) ? (
    <div className="flex flex-col">
      <Navbar />
      <div className="pt-16 flex flex-row h-screen bg-gray-50">
        <div className="w-72 flex flex-col sticky top-16 pt-10">
          <List>
            <ListItem disablePadding>
              <ListItemButton
                sx={{ color: "green" }}
                color="success"
                selected={pathName == "/"}
                onClick={() => router.push("/")}
              >
                <ListItemIcon>
                  <HomeIcon className="h-7 w-7  " />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                sx={{ color: "green" }}
                color="success"
                selected={pathName.startsWith("/musrif")}
                onClick={() => router.push("/musrif")}
              >
                <ListItemIcon>
                  <AcademicCapIcon className="h-7 w-7" />
                </ListItemIcon>
                <ListItemText primary="Musrif" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                sx={{ color: "green" }}
                color="success"
                selected={pathName.startsWith("/santri")}
                onClick={() => router.push("/santri")}
              >
                <ListItemIcon>
                  <UserIcon className="h-7 w-7  " />
                </ListItemIcon>
                <ListItemText primary="Santri" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                sx={{ color: "green" }}
                color="success"
                selected={pathName.startsWith("/halaqoh")}
                onClick={() => router.push("/halaqoh")}
              >
                <ListItemIcon>
                  <InboxIcon className="h-7 w-7" />
                </ListItemIcon>
                <ListItemText primary="Halaqoh" />
              </ListItemButton>
            </ListItem>
            
          </List>
          <Divider />
          <div className=" mt-2 w-full px-2">
            <Button
              variant="contained"
              color="error"
              fullWidth
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </div>
        </div>
        <div className="flex-1 h-full ">
          <div className="border-2 h-full rounded-tl-2xl border-gray-200 overflow-scroll bg-white">
            {children}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="">{children}</div>
  );
};

export default Template;
