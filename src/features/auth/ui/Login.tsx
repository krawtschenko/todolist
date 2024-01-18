import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Navigate } from "react-router-dom";
import { loginTC } from "features/auth/model/authSlice";
import {useAppSelector} from "common/hooks/useAppSelector";
import {selectAuthSlice} from "features/auth/model/authSelectors";
import {useAppDispatch} from "common/hooks/useAppDispatch";

interface IFormInput {
  email: string;
  password: string;
  rememberMe: boolean;
}

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(3).required(),
  rememberMe: yup.boolean().required(),
});

export const Login = () => {
  const isLoggedIn = useAppSelector(selectAuthSlice.isLoggedIn);
  const dispatch = useAppDispatch();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<IFormInput>({
    mode: "onBlur",
    resolver: yupResolver(schema),
    defaultValues: {
      email: "Eugenykravchenko@gmail.com",
      password: "010982_JKjk",
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    dispatch(loginTC(data));
    reset();
  };

  if (isLoggedIn) {
    return <Navigate to={"/"} />;
  }

  return (
    <Grid container justifyContent={"center"}>
      <Grid item justifyContent={"center"}>
        <form onSubmit={handleSubmit(onSubmit)}>
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
              <TextField label="Email" margin="normal" {...register("email")} />
              {errors.email && <span style={{ color: "red" }}>{errors.email.message}</span>}

              <TextField type="password" label="Password" margin="normal" {...register("password")} />
              {errors.password && <span style={{ color: "red" }}>{errors.password.message}</span>}

              <FormControlLabel label={"Remember me"} control={<Checkbox />} {...register("rememberMe")} />
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
