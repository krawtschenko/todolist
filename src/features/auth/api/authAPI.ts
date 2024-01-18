import {ILoginParams, IResponse} from "common/interfaces";
import {instance} from "common/instance";

export const authAPI = {
	login: (data: ILoginParams) => {
		return instance.post<IResponse<{ userId: number }>>("auth/login", data);
	},
	logout: () => {
		return instance.delete<IResponse>("auth/login");
	},
	me: () => {
		return instance.get<IResponse<{ id: number; email: string; login: string }>>("auth/me");
	},
};