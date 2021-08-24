const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");
const { check, body } = require("express-validator");
const User = require('../model/user')

router.get("/login", authController.getLogin);
router.post(
  "/login",
  [check("email").isEmail().withMessage("wrong")],
  authController.postLogin
);
router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  
    check("email")
      .isEmail()
      .withMessage("wrong")
      .custom((value) => {
          return User.findOne({email:value}).then(user => {
              if(user){
                   return Promise.reject('Email already exists')
              }
          })
      }),
      check('password')
      .isLength({min:5})
      .withMessage("password must be longer than 5")
      
    
  ,
  authController.postSignup
);


router.get('/reset-email', authController.resetEmail)

router.post('/reset-email', authController.postResetEmail)

router.get('/reset-password/:token', authController.resetPage)

router.post('/new-password', authController.postReset)

module.exports = router;
