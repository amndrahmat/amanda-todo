import { useState } from "react";
import { useTodosContext } from "../hooks/useTodosContext";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Alert from "@mui/material/Alert";

const defaultTheme = createTheme();

export default function TodoForm() {
  const { dispatch } = useTodosContext();
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(0);

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!data.get("title")) {
      setError("Title is required");
    } else if (!data.get("description")) {
      setError("Description is required");
    } else {
      const todo = {
        title: data.get("title"),
        description: data.get("description"),
        status: status === 0 ? "pending" : "completed",
      };
      const response = await fetch("/api/todos", {
        method: "POST",
        body: JSON.stringify(todo),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
      }

      if (response.ok) {
        setError(null);
        dispatch({ type: "CREATE_TODO", payload: json });
      }
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    
    const response = await fetch("/api/todos?title=" + data.get("search"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }

    if (response.ok) {
      setError(null);
      dispatch({ type: "SET_TODOS", payload: json });
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Search Todo List
          </Typography>
          <Box
            component="form"
            onSubmit={handleSearch}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="search"
              label="Search"
              name="search"
              autoComplete="search"
              autoFocus
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Search
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Input Todo List
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Title"
              name="title"
              autoComplete="title"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="description"
              label="Description"
              name="description"
              autoComplete="description"
              autoFocus
            />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-helper-label">
                Status
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                required
                id="status"
                value={status}
                label="Status"
                name="status"
                autoFocus
                onChange={handleChange}
              >
                <MenuItem value={0}>Pending</MenuItem>
                <MenuItem value={1}>Completed</MenuItem>
              </Select>
            </FormControl>
            <br></br>
            {error ? (
              <>
                <br></br>
                <Alert severity="error">{error}</Alert>
                <br></br>
              </>
            ) : null}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
