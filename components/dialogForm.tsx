import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { ReactNode } from "react"

interface DialogProps {
    children: ReactNode;
    open: boolean;
    handleClose: () => void;
    handleSubmit: () => void;
}

export const DialogForm = ({children, open, handleClose, handleSubmit} : DialogProps) => {
    return (
        <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          sx: {overflow: 'visible'},
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleSubmit()
            handleClose();
          },
        }}
      >
        {children}
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Dialog>
    )
}