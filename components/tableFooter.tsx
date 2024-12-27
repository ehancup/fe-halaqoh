import { GridFooterContainer } from "@mui/x-data-grid";
import CustomPagination from "./pagination";
import { SelectChangeEvent } from "@mui/material";
import SelectInput from "./selectInput";

interface TFooterProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (e: number) => void;
  onPageSizeChange: (e: SelectChangeEvent<any>) => void;
}

export  const paginationOption = [
    { label: "1", value: 1 },
    { label: "10", value: 10 },
    { label: "15", value: 15 },
    { label: "25", value: 25 },
  ];

export default function CustomFooter({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: TFooterProps) {
  return (
    <GridFooterContainer className="p-3">
      <div style={{ flex: 1, textAlign: "left", paddingLeft: "16px" }}>
        Total Data: {total} items
      </div>
      <div className=" w-32 mr-5">
        <SelectInput
          sm
          id="pageSize"
          fullWidth
          name="pageSize"
          handleChange={onPageSizeChange}
          value={pageSize}
          option={paginationOption}
          label="Page Size"
        />
      </div>
      <CustomPagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
      />
    </GridFooterContainer>
  );
}
