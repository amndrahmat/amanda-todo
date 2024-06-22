const Todo = require("../models/todoModel");
const mongoose = require("mongoose");

const getTodos = async (req, res) => {
  const titleQuery = req.query.title
    ? { title: { $regex: new RegExp(req.query.title, "i") } }
    : {};
  const todos = await Todo.find(titleQuery).sort({ createdAt: -1 });
  res.status(200).json(todos);
};

const getTodo = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Id" });
  }

  const todo = await Todo.findById(id);
  if (!todo) {
    return res.status(404).json({ error: "No such todo" });
  }

  res.status(200).json(todo);
};

const createTodo = async (req, res) => {
  const { title, description, status } = req.body;
  let emptyFields = [];

  if (!title) {
    emptyFields.push("title");
  }
  if (!description) {
    emptyFields.push("description");
  }
  if (!status) {
    emptyFields.push("status");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }
  try {
    const todo = await Todo.create({
      title,
      description,
      status,
    });
    res.status(200).json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteTodo = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Id" });
  }
  const todo = await Todo.findOneAndDelete({ _id: id });
  if (!todo) {
    return res.status(404).json({ error: "No such todo" });
  }

  res.status(200).json({ success: true });
};

const updateTodo = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Id" });
  }

  const todo = await Todo.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );
  if (!todo) {
    return res.status(404).json({ error: "No such todo" });
  }

  res.status(200).json(todo);
};

module.exports = {
  getTodos,
  getTodo,
  createTodo,
  deleteTodo,
  updateTodo,
};
