import express from "express";
import { insertNewTrans } from "../models/transactions/TransactionModel.js";
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
    console.log(req.body);
    const { authorization } = req.headers;

    const result = await insertNewTrans({ ...req.body, userId: authorization });
    result?._id
      ? res.json({
          status: "success",
          message: "todo post",
        })
      : res.json({
          status: "error",
          message: " Unable to process your req, try again later",
        });
  } catch (error) {
    console.log(error);
  }
});

export default router;
