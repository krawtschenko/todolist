import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, {AlertProps} from "@mui/material/Alert";
import {appActions, appSelectors} from "app/model/appSlice";
import {useAppDispatch} from "common/hooks/useAppDispatch";
import {useSelector} from "react-redux";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function ErrorSnackbar() {
	const dispatch = useAppDispatch();
	const error = useSelector(appSelectors.selectError);

	const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === "clickaway") {
			return;
		}

		dispatch(appActions.setAppError(null));
	};
	return (
		<Snackbar open={error !== null} autoHideDuration={6000} onClose={handleClose}>
			<Alert onClose={handleClose} severity="error" sx={{width: "100%"}}>
				{error}
			</Alert>
		</Snackbar>
	);
}
