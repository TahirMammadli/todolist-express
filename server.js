const express = require("express");
const app = express();
require('dotenv').config({path: __dirname + '/.env'})
const path = require("path");
const bodyParser = require("body-parser");
const todoRoutes = require("./routes/todo");
const authRoutes = require("./routes/auth")
const mongoose = require("mongoose");
const session = require('express-session')
const MongDBStore = require('connect-mongodb-session')(session)
const MONGODB_URI = process.env['MONGODB_URI'];
const flash = require('connect-flash')


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public/css")));

app.set("view engine", "ejs");
app.set("views", "views");

const store = new MongDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  store: store

}))


app.use(flash())

app.use((req,res,next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn
  next()
})

app.use(todoRoutes);
app.use(authRoutes)

mongoose
  .connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => {
    console.log("Connected!");
    app.listen(3000);
  })
  .catch((err) => console.log(err));
