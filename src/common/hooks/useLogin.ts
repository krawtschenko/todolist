import * as yup from "yup";
import {authActions} from "features/auth/model/authSlice";
import {useAppDispatch} from "common/hooks/useAppDispatch";
import {SubmitHandler, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";

interface IFormInput {
	email: string;
	password: string;
	rememberMe: boolean;
}

export const useLogin = () => {
	const schema = yup.object({
		email: yup.string().email().required(),
		password: yup.string().min(3).required(),
		rememberMe: yup.boolean().required(),
	});

	const dispatch = useAppDispatch();

	const form = useForm<IFormInput>({
		mode: "onBlur",
		resolver: yupResolver(schema),
		defaultValues: {
			email: "Eugenykravchenko@gmail.com",
			password: "010982_JKjk",
		},
	});

	const onSubmit: SubmitHandler<IFormInput> = (data) => {
		dispatch(authActions.login(data)).then(() => {
			form.reset()
		});
	};

	return {form, onSubmit}
}