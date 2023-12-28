import "./App.css";
import AppBar from "@mui/material/AppBar/AppBar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import { Menu } from "@mui/icons-material";
import LinearProgress from "@mui/material/LinearProgress";
import { TodoListsList } from "../todoList/TodoListsList";
import { useAppSelector } from "../../state/store";
import { ErrorSnackbar } from "../errorSnackbar/ErrorSnackbar";
import { Login } from "../auth/login/Login";
import {
  Navigate,
  Route,
  Router,
  RouterProvider,
  Routes,
  createBrowserRouter,
} from "react-router-dom";

function App() {
  const status = useAppSelector((state) => state.app.status);

  return (
    <div className="App">
      <ErrorSnackbar />
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Button color="inherit">Login</Button>
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
