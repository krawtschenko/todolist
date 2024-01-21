import "app/App.css";
import AppBar from "@mui/material/AppBar/AppBar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import {Menu} from "@mui/icons-material";
import LinearProgress from "@mui/material/LinearProgress";
import {ErrorSnackbar} from "common/components/errorSnackbar/ErrorSnackbar";
import {Login} from "features/auth/ui/Login";
import {Navigate, RouterProvider, createBrowserRouter} from "react-router-dom";
import {TodoListsList} from "features/todoLists/ui/TodoListsList";
import {useEffect} from "react";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import {selectAppSlice} from "app/model/appSelectors";
import {useAppSelector} from "common/hooks/useAppSelector";
import {selectAuthSlice} from "features/auth/model/authSelectors";
import {useAppDispatch} from "common/hooks/useAppDispatch";
import {authActions} from "features/auth/model/authSlice";

function App() {
	const status = useAppSelector(selectAppSlice.status);
	const isInitialized = useAppSelector(selectAppSlice.isInitialized);
	const isLoggedIn = useAppSelector(selectAuthSlice.isLoggedIn);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(authActions.initializeApp());
	}, []);

	const logout = () => {
		dispatch(authActions.logout());
	};

	if (!isInitialized) {
		return (
			<div style={{position: "fixed", top: "30%", textAlign: "center", width: "100%"}}>
				<CircularProgress/>
			</div>
		);
	}

	return (
		<div className="App">
			<ErrorSnackbar/>
			<AppBar position="static">
				<Toolbar style={{display: "flex", justifyContent: "space-between"}}>
					<IconButton edge="start" color="inherit" aria-label="menu">
						<Menu/>
					</IconButton>
					{isLoggedIn && (
						<Button onClick={logout} color="inherit">
							Logout
						</Button>
					)}
				</Toolbar>
				{status === "loading" && <LinearProgress/>}
			</AppBar>
			<Container fixed>
				{/* <TodoListsList /> */}
				{/* <Routes>
          <Route path="/" element={<TodoListsList />} />
          <Route path="/ui" element={<Login />} />
          <Route path="/404" element={<h1>Error 404</h1>} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes> */}
				<RouterProvider router={router}/>
			</Container>
		</div>
	);
}

const router = createBrowserRouter([
	{
		path: "/",
		element: <TodoListsList/>,
	},
	{
		path: "/ui",
		element: <Login/>,
	},
	{
		path: "/404",
		element: <h1>Error 404</h1>,
	},
	{
		path: "*",
		element: <Navigate to="/404"/>,
	},
]);

export default App;
