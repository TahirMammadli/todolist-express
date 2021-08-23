const User = require("../model/user");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const SENDGRID_API_KEY = process.env["SENDGRID_API_KEY"];
const sendGrid = require("@sendgrid/mail");
sendGrid.setApiKey(SENDGRID_API_KEY);
const msg = {
  to: "tahirmammadli13@gmail.com",
  from: "forsendgrid1@gmail.com",
  subject: "no subject",
  text: "signed up",
};

exports.getLogin = (req, res, next) => {
  res.render("auth/login");
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email }).then((user) => {
    console.log(user)
    if (user) {
      bcrypt.compare(password,user.password).then((match) => {
        if (!match) {
          res.redirect("/login");
        }else{
        req.session.isLoggedIn = true;
        res.redirect("/");
        }
      });
    }
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup");
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.send(errors.array()[0].msg);
  }
  return bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
      });
      return user.save();
    })
    .then((result) => {
      console.log("user saved to db");
      res.redirect("/login");
      sendGrid.send(msg).then(
        () => {},
        (err) => console.log(err)
      );
    })
    .catch((err) => console.log(err));
};

exports.resetPassword = (req, res, next) => {
  res.render("auth/reset-password");
};

exports.postResetPassword = (req, res, next) => {
  const email = req.body.email;
  let token;
  crypto.randomBytes(12, (err, buffer) => {
    if (err) {
      console.log(err);
      res.redirect("/reset-password");
    }
    token = buffer.toString("hex");
  });
  User.findOne({ email: email }).then((user) => {
    if (user) {
      res.redirect("/login");
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      user.save().then((result) => {
        const passwordResetMsg = {
          to: "tahirmammadli13@gmail.com",
          from: "forsendgrid1@gmail.com",
          subject: "no subject",
          html: `<a href="http://localhost:3000/reset/${token}">Link</a>`,
        };
        sendGrid.send(passwordResetMsg).then(
          () => {},
          (err) => console.log(err)
        );
      });
    }
    else{
    res.send("a user with this Email doesnt exist");
    }
  });
};

exports.resetPage = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token }).then((user) => {
    if (user.resetTokenExpiration > Date.now()) {
      res.render("auth/reset-page", { user: user });
    }else{
    res.send("Expired");
    }
  });
};

exports.postReset = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  let resetUser;

  User.findOne({ _id: userId }).then((user) => {
    console.log(user)
    console.log("newpassword",newPassword)
    console.log("user's password", user.password)
    resetUser = user;
    return bcrypt.hash(newPassword, 12)})
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      return resetUser.save()

    }).then(result => {
      res.redirect('/')
    })
  
  .catch(err => console.log(err))
};
