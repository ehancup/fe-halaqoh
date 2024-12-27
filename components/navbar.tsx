import { Button } from "@mui/material";
import { useSession } from "next-auth/react";

const Navbar = () => {
    const {data:session} = useSession()
  return (
    <div className="w-full p-3 flex flex-row justify-between fixed inset-x-0 top-0">
      <div className="">
        <Button variant="text" color="success" size="large">
          Halaqoh Admin
        </Button>
      </div>
      <div className="flex flex-row">
        <p className="text-black">{session?.user.email}</p>
        <p className="text-black">test</p>
      </div>
    </div>
  );
};

export default Navbar;
