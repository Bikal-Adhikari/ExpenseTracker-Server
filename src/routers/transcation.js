import express from "express";
import {
  getTransactionByUserId,
  insertNewTrans,
} from "../models/transactions/TransactionModel.js";
const router = express.Router();

// router = {
//     get("/", (req,res)=>{}) ,
//     post(){}

// }

router.get("/", async (req, res) => {
  try {
    const { authorization } = req.headers;
    const trans = (await getTransactionByUserId(authorization)) ?? [];
    res.json({
      status: "success",
      message: "Here are the list of the transactions",
      trans,
    });
  } catch (error) {
    res.status(500).json({
      status: "server error",
      message: `Server Error ${error}`,
    });
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
    res.status(500).json({
      status: "server error",
      message: `Server Error ${error}`,
    });
  }
});

export default router;
