import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from '@mui/material/LinearProgress';

export default function PaytmentDialog({ open }) {
    return (
        <div>
            <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Processing Payment"}
                </DialogTitle>
                <DialogContent
                    sx={{
                        marginTop: "10px",
                    }}
                >
                    <LinearProgress />
                    <br/>
                    <DialogContentText id="alert-dialog-description">
                        A request has been sent to Bank.
                    </DialogContentText>
                    <DialogContentText id="alert-dialog-description">
                        Please wait for the payment to be processed.
                    </DialogContentText>
                    <DialogContentText id="alert-dialog-description">
                        You will be shown transaction receipt once the payment
                        is processed.
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
}
