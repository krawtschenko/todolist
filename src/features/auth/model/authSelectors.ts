import {RootState} from "app/store";

export const selectAuthSlice = {
	isLoggedIn: (state: RootState) => state.authSlice.isLoggedIn,
};
