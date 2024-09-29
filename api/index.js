import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import listingRouter from "./routes/listing.route.js";

dotenv.config();

// URI for MongoDB comes form the .env file
mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(() => {
    // console.log("Connection to DB is successfull");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});

app.use("/api/user", userRouter);

app.use("/api/auth", authRouter);

app.use("/api/listing", listingRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500; // default to 500 if none comes
  const msg =
    err.message || // from error
    "Internal Server Error. Please contact System Admin"; // or default msg
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message: msg,
  });
});
