const express = require("express");
const router = express.Router();
const todoController = require('../controller/todo');

router.get("/", todoController.getTodos)

router.get("/add-todo", todoController.getAddTodo)

router.post("/add-todo", todoController.postTodo)

router.get("/edit-todo/:todoId", todoController.editTodo)

router.post("/edit-todo/:todoId", todoController.postEditTodo)

router.post("/delete/:todoId", todoController.deleteTodo)



module.exports = router;
