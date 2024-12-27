import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import clsx from "clsx";
import React, { ChangeEvent, InputHTMLAttributes, SelectHTMLAttributes } from "react";

interface InputProps {
  label?: string;
  isError?: boolean;
  fullWidth?: boolean;
  messageError?: string;
  id: string | number;
  name: string;
  value?: string | number | undefined | null;
  sm?: boolean;
  isRequired?: boolean;
  option?: { label: string; value: any }[];
  handleChange: (event: SelectChangeEvent<any>) => void;
}

const SelectInput = ({
  label,
  isRequired,
  sm,
  isError = false,
  fullWidth = false,
  name,
  id,
  value,
  messageError = "something went wrong",
  option = [],
  handleChange,
  ...props
}: InputProps & SelectHTMLAttributes<HTMLSelectElement>) => {
  return (
    // <label className="form-control w-full" htmlFor={name}>
    //   <div className="label pb-1 ">
    //     {label ? (
    //       <span
    //         className={`label-text font-medium text-base ${
    //           isError ? "text-error" : ""
    //         }`}
    //       >
    //         {label}
    //         {isRequired ? <span className="text-red-600">*</span> : <></>}
    //       </span>
    //     ) : (
    //       <></>
    //     )}
    //   </div>

    //   <select
    //   id={id}
    //   name={name}
    //   className={clsx("select select-bordered w-full select-md", {
    //     "select-sm": sm,
    //     "select-error": isError,
    //   })}
    //   value={value}
    //   {...props}>
    //     <option disabled selected value={""}>
    //       Pick one
    //     </option>
    //     {option.map((e, i) => {
    //         return <option key={i} value={e.value}>{e.label}</option>
    //     })}
    //   </select>
    //   {isError ? (
    //     <div className="label pb-0">
    //       <span className="label-text-alt text-error">{messageError}</span>
    //     </div>
    //   ) : (
    //     <></>
    //   )}
    // </label>
    <FormControl fullWidth={fullWidth} error={isError} required={isRequired}>
      <InputLabel id={id}>{label}</InputLabel>
      <Select
        labelId={id}
        id={id}
        name={name}
        value={value}
        label={label}
        color="success"
        onChange={handleChange}
        size={sm ? "small" : "medium"}
      >
        <MenuItem disabled selected>select a option</MenuItem>
        {option.map((e, i) => {
            return <MenuItem value={e.value} key={i}>{e.label}</MenuItem>
        })}
      </Select>
      <FormHelperText>{isError && messageError}</FormHelperText>
    </FormControl>
  );
};

export default SelectInput;
