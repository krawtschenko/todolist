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

function App() {
  const status = useAppSelector((state) => state.app.status);

  return (
    <div className="App">
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
        <TodoListsList />
      </Container>
    </div>
  );
}

export default App;
