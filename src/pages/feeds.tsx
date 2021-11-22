import {useParams} from "react-router";
import {Dialog, DialogTitle} from "@mui/material";

interface Props {
    onClose: () => void;
    filter: string;
    open: boolean;
}

const FeedsDialog = (props: Props) => {
    const { onClose, filter, open } = props;

    const handleClose = () => {
        onClose();
    };

   /* const handleListItemClick = (value) => {
        onClose(value);
    };*/

    return (<Dialog onClose={handleClose} open={open}>
            <DialogTitle>Set backup account</DialogTitle>
            This is a dialog
        </Dialog>
    );
}

export default FeedsDialog;