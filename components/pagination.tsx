import { FilterSantri } from "@/lib/santri";
import { Pagination } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

interface PaginationProps {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (e: number) => void;
}

export default function CustomPagination({ page, pageSize, total, onPageChange } : PaginationProps) {
    const totalPages = Math.ceil(total / pageSize);
  
    return (
      <Pagination
        count={totalPages}
        page={page} // Pagination MUI dimulai dari 1, tapi DataGrid mulai dari 0
        onChange={(_, value) => onPageChange(value)}
        color="secondary"
        variant="outlined"
  
      />
    );
  }