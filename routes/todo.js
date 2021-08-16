const express = require("express");
const router = express.Router();
const todoController = require('../controller/todo')

router.get("/", todoController.getTodos)

router.get("/add-todo", todoController.getAddTodo)

router.post("/add-todo", todoController.postTodo)


module.exports = router;
