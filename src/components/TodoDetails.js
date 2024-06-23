import * as React from "react";
import { useTodosContext } from "../hooks/useTodosContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CssBaseline from "@mui/material/CssBaseline";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import GlobalStyles from "@mui/material/GlobalStyles";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
const defaultTheme = createTheme();

export default function TodoDetails({ todo }) {
  const [open, setOpen] = React.useState(false);
  const { dispatch } = useTodosContext();

  const handleClick = async () => {
    const response = await fetch("https://amanda-todo.onrender.com/api/todos/" + todo._id, {
      method: "DELETE",
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_TODO", payload: json });
      window.location.reload();
    }
  };

  const handleUpdate = async () => {
    const response = await fetch("https://amanda-todo.onrender.com/api/todos/" + todo._id, {
      method: "PATCH",
      body: JSON.stringify({
        status: "completed",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "UPDATE_TODO", payload: json });
      window.location.reload();
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />
      <CssBaseline />
      <Container
        disableGutters
        maxWidth="sm"
        component="main"
        sx={{ pt: 3, pb: 3 }}
      ></Container>
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          <Grid item key={todo.title} xs={12} sm={12} md={12}>
            <Card>
              <CardHeader
                title={todo.title}
                subheader={todo.status}
                titleTypographyProps={{
                  align: "center",
                  color: "primary",
                  fontSize: "40px",
                }}
                subheaderTypographyProps={{
                  align: "center",
                  fontSize: "12px",
                }}
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === "light"
                      ? theme.palette.grey[200]
                      : theme.palette.grey[700],
                }}
              />
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    {todo.description}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                  }}
                >
                  <p>
                    {formatDistanceToNow(new Date(todo.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleClickOpen}
                  color="error"
                  startIcon={<DeleteIcon />}
                >
                  DELETE
                </Button>
              </CardActions>

              <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
              >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                  Delete
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={handleClose}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                  <Typography gutterBottom>
                    Are you really want to delete?
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <CardActions onClick={handleClick}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </DialogActions>
              </BootstrapDialog>

              {todo.status === "pending" && (
                <CardActions onClick={handleUpdate}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<CheckIcon />}
                  >
                    Done
                  </Button>
                </CardActions>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
