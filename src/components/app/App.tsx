import "./App.css";
import AppBar from "@mui/material/AppBar/AppBar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import { Menu } from "@mui/icons-material";
import LinearProgress from "@mui/material/LinearProgress";
import { useAppDispatch, useAppSelector } from "../../state/store";
import { ErrorSnackbar } from "../errorSnackbar/ErrorSnackbar";
import { Login } from "../auth/login/Login";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { TodoListsList } from "../todoList/TodoListsList";
import { initializeAppTC } from "../../state/appReducer/app-reducer";
import { useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import { logoutTC } from "../../state/authReducer/authReducer";

function App() {
  const status = useAppSelector((state) => state.app.status);
  const isInitialized = useAppSelector((state) => state.app.isInitialized);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAppTC());
  }, []);

  const logout = () => {
    dispatch(logoutTC());
  };

  if (!isInitialized) {
    return (
      <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="App">
      <ErrorSnackbar />
      <AppBar position="static">
        <Toolbar style={{display: 'flex', justifyContent: 'space-between'}}>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          {isLoggedIn && (
            <Button onClick={logout} color="inherit">
              Logout
            </Button>
          )}
        </Toolbar>
        {status === "loading" && <LinearProgress />}
      </AppBar>
      <Container fixed>
        {/* <TodoListsList /> */}
        {/* <Routes>
          <Route path="/" element={<TodoListsList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/404" element={<h1>Error 404</h1>} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes> */}
        <RouterProvider router={router} />
      </Container>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <TodoListsList />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/404",
    element: <h1>Error 404</h1>,
  },
  {
    path: "*",
    element: <Navigate to="/404" />,
  },
]);

export default App;
