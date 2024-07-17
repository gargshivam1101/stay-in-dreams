import express from "express";

const userRouter = express.Router();

userRouter.get("/test", (req, res) => {
  res.send("Hello, from User");
});

export default userRouter;
