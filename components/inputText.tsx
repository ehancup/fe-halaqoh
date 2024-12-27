import clsx from "clsx";
import React, { InputHTMLAttributes, useState } from "react";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import { OverridableStringUnion } from '@mui/types';
import TextField from '@mui/material/TextField';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { InputBasePropsColorOverrides } from "@mui/material";

interface InputProps {
  label?: string;
  isError?: boolean;
  fullWidth?: boolean;
  messageError?: string;
  id: string | number;
  name: string;
  value?: string | number | undefined;
  sm?: boolean;
  lg?: boolean;
  isRequired?: boolean;
  protect?: boolean;
  color?: OverridableStringUnion<"error" | "primary" | "secondary" | "info" | "success" | "warning", InputBasePropsColorOverrides>;
}

const InputText = ({
  label,
  isRequired,
  sm = false,
  isError = false,
  fullWidth = false,
  protect = false,
  name,
  id,
  value,
  messageError = "something went wrong",
  lg = false,
  type,
  color,
  ...props
}: InputProps & InputHTMLAttributes<HTMLInputElement> | any) => {
  const [isHide, setIsHide] = useState<boolean>(true);
  return (
    // <label className="form-control w-full" htmlFor={name}>
    //   {label ? (
    //     <div className="label ">
    //       <span
    //         className={`label-text font-medium text-base ${
    //           isError ? "text-error" : ""
    //         }`}
    //       >
    //         {label}
    //         {isRequired ? <span className="text-red-600">*</span> : <></>}
    //       </span>
    //     </div>
    //   ) : (
    //     <></>
    //   )}
    //   <div
    //     className={clsx(
    //       "input input-bordered w-full flex items-center gap-2 ",
    //       {
    //         "input-sm": sm,
    //         "input-lg": lg,
    //         "input-error": isError,
    //       }
    //     )}
    //   >
    //     <input
    //       id={id}
    //       name={name}
    //       className="grow"
    //       value={value}
    //       {...props}
    //       type={type || (isHide && protect ? "password" : "text")}
    //     />
    //     {protect ? (
    //       <button
    //         className="btn btn-circle btn-ghost btn-sm"
    //         onClick={() => setIsHide((prev) => !prev)}
    //         type="button"
    //       >
    //         {isHide ? (
    //           <EyeSlashIcon className="w-4 h-4 opacity-70" />
    //         ) : (
    //           <EyeIcon className="w-4 h-4 opacity-70" />
    //         )}
    //       </button>
    //     ) : (
    //       <div className="hidden"></div>
    //     )}
    //   </div>
    //   {isError ? (
    //     <div className="label pb-0">
    //       <span className="label-text-alt text-error">{messageError}</span>
    //     </div>
    //   ) : (
    //     <></>
    //   )}
    // </label>
    <FormControl fullWidth={fullWidth} variant="outlined">
          <InputLabel htmlFor={id} >{label}</InputLabel>
          <OutlinedInput
            id={id}
            name={name}
            required={isRequired}
            type={protect && isHide ? 'password' : 'text'}
            error={isError}
            value={value}
            color={"success"}
            endAdornment={ protect &&
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setIsHide((prev) => !prev)}
                //   onMouseDown={handleMouseDownPassword}
                //   onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {isHide ? <EyeSlashIcon className="w-4 h-4 opacity-70" /> : <EyeIcon className="w-4 h-4 opacity-70" />}
                </IconButton>
              </InputAdornment>
            }
            label={label}
            
            {...props}
          />
          <FormHelperText sx={{ color: "red" }}>{isError && messageError}</FormHelperText>
        </FormControl>
  );
};

export default InputText;
