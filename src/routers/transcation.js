import express from "express";
import {
  deleteTransactionForUser,
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
      message: `Server Error ${error.message}`,
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
          message: "New transactions added",
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

router.delete("/", async (req, res) => {
  try {
    const { authorization } = req.headers;
    const result = await deleteTransactionForUser(authorization, req.body);
    result?.deletedCount
      ? res.json({
          status: "success",
          message: "The transactions have been deleted sucessfully",
        })
      : res.json({
          status: "failure",
          message: "Unable to find the transaction you are trying to delete",
        });
  } catch (error) {
    res.status(500).json({
      status: "server error",
      message: `Server Error ${error}`,
    });
  }
});

export default router;
