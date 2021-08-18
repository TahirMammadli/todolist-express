const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const todoRoutes = require("./routes/todo");
const authRoutes = require("./routes/auth")
const mongoose = require("mongoose");
const { MONGODB_URI } = require("./config");
const session = 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public/css")));

app.set("view engine", "ejs");
app.set("views", "views");

app.use(todoRoutes);
app.use(authRoutes)

mongoose
  .connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => {
    console.log("Connected!");
    app.listen(3000);
  })
  .catch((err) => console.log(err));
