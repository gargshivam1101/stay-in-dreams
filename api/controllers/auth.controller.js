import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
// import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  // some code
  console.log(req.body);
  const { username, email, password } = req.body;
  const encryptPwd = bcryptjs.hashSync(password, 10); // salt defaults to 10
  const newUser = new User({ username, email, password: encryptPwd });
  try {
    await newUser.save();
    res.status(201).json("Success");
  } catch (err) {
    next(err);
    // next(errorHandler(501, 'Custom Error'));
  }
};
