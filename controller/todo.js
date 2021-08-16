const Todo = require("../model/todo");
let totalTodos;
const TODO_PER_PAGE = 3;

exports.getTodos = (req, res, next) => {
  const page = +req.query.page || 1;

  Todo.countDocuments().then((numOfTodos) => {
    totalTodos = numOfTodos;
    return Todo.find()
      .skip((page - 1) * TODO_PER_PAGE)
      .limit(TODO_PER_PAGE)
      .then((todos) => {
        res.render("index", {
          todos: todos,
          currentPage: page,
          hasNextPage: TODO_PER_PAGE * page < totalTodos,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalTodos / TODO_PER_PAGE),
        });
      });
  });
};

exports.getAddTodo = (req, res, next) => {
  res.render("add-todo");
};

exports.postTodo = (req, res, next) => {
  const title = req.body.title;
  const body = req.body.body;

  const todo = new Todo({
    title: title,
    body: body,
  });

  todo
    .save()
    .then((result) => console.log("added to db"))
    .catch((err) => console.log(err));
  res.redirect("/");
};
