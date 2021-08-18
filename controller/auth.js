const User = require("../model/user");
const bcrypt = require("bcryptjs");
const { validationResult } = require('express-validator') 

exports.getLogin = (req, res, next) => {
  res.render("auth/login");
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    // return a user object if the email exists in the db. If not, then return an empty object
    User.findOne({email: email}).then(email => {
        
            console.log(email)
            if(email){
                res.redirect('/')
            }else{
                res.redirect('/login')
            }

         
    })
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup");
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req)

  if(!errors.isEmpty()){
    res.send(errors.array()[0].msg)
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
    })
    .catch((err) => console.log(err));
};
