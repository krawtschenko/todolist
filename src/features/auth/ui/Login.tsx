import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {Navigate} from "react-router-dom";
import {authSelectors} from "features/auth/model/authSlice";
import {useSelector} from "react-redux";
import {useLogin} from "common/hooks/useLogin";

export const Login = () => {
	const isLoggedIn = useSelector(authSelectors.selectIsLoggedIn);
	const {form, onSubmit} = useLogin()
	const errors = form.formState.errors

	if (isLoggedIn) {
		return <Navigate to={"/"}/>;
	}

	return (
		<Grid container justifyContent={"center"}>
			<Grid item justifyContent={"center"}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FormControl>
						<FormLabel>
							<p>
								To log in get registered
								<a href={"https://social-network.samuraijs.com/"} target={"_blank"} rel="noreferrer">
									{" "}
									here
								</a>
							</p>
							<p>or use common test account credentials:</p>
							<p>Email: free@samuraijs.com</p>
							<p>Password: free</p>
						</FormLabel>
						<FormGroup>
							<TextField label="Email" margin="normal" {...form.register("email")} />
							{errors.email && <span style={{color: "red"}}>{errors.email.message}</span>}

							<TextField type="password" label="Password" margin="normal" {...form.register("password")} />
							{errors.password && <span style={{color: "red"}}>{errors.password.message}</span>}

							<FormControlLabel label={"Remember me"} control={<Checkbox/>} {...form.register("rememberMe")} />
							<Button type={"submit"} variant={"contained"} color={"primary"}>
								Login
							</Button>
						</FormGroup>
					</FormControl>
				</form>
			</Grid>
		</Grid>
	);
};
