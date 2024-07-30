import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

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

export const login = async (req, res, next) => {
  // some code
  console.log(req.body);
  const { email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      // check if user email exists
      return next(errorHandler(404, "User not found"));
    }

    const checkPwd = bcryptjs.compareSync(password, checkUser.password);
    if (!checkPwd) {
      // check if password is correct
      return next(errorHandler(401, "Wrong credentials"));
    }

    // use cookies for session
    const token = jwt.sign({ id: checkUser._id }, process.env.JWT_SECRET);

    // checkUser contains password, which should not be a part of our response for security
    const { password: pwd, ...rem } = checkUser._doc;

    res.cookie("access_token", token, { httpOnly: true }).status(200).json(rem);
  } catch (err) {
    next(err);
  }
};
