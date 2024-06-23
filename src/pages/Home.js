import { useEffect } from "react";
import { useTodosContext } from "../hooks/useTodosContext";
import TodoDetails from "../components/TodoDetails";
import TodoForm from "../components/TodoForm";
import Grid from "@mui/material/Grid";

const Home = () => {
  const { todos, dispatch } = useTodosContext();

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch("https://amanda-todo.onrender.com/api/todos");
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_TODOS", payload: json });
      }
    };

    fetchTodos();
  }, [dispatch]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
      <TodoForm />
      </Grid>
      <Grid item xs={12} md={8}>
      {todos &&
          todos.map((todo) => (
            <TodoDetails todo={todo} key={todo._id} />
          ))}
      </Grid>
    </Grid>
  );
};

export default Home;
