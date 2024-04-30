import express from "express";
import { insertUser } from "../models/user/UserModel.js";
import { comparePassword, hasPassword } from "../utils/bcryptjs.js";
import { getUserByEmail } from "../models/user/UserModel.js";
const router = express.Router();

// router = {
//     get("/", (req,res)=>{}) ,
//     post(){}

// }

router.get("/", (req, res) => {
  try {
    res.json({
      status: "success",
      message: "todo get",
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  try {
    req.body.password = hasPassword(req.body.password);
    const result = await insertUser(req.body);

    result?._id
      ? res.json({
          status: "success",
          message: "Your new account has been created, You may login now",
        })
      : res.json({
          status: "error",
          message: "Unable to process your request try again later",
        });
  } catch (error) {
    let code = 500;
    if (error.message.includes("E11000 duplicate key error")) {
      code = 200;
      error.message =
        "There is already another account associated to this email. Use different email to signup.";
    }
    res.status(code).json({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // get the user email and get user from db
    const user = await getUserByEmail(email);

    if (user?._id) {
      //compare password

      const isMatched = comparePassword(password, user.password);
      user.password = undefined;
      if (isMatched) {
        //authorized
        return res.json({
          status: "success",
          message: "Login sucessfully",
          user,
        });
      }
    }
    res.json({
      status: "error",
      message: "Invalid credentials",
      user,
    });
  } catch (error) {
    let code = 500;
    res.status(code).json({
      status: "error",
      message: error.message,
    });
  }
});

export default router;
