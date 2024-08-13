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

export const google = async (req, res, next) => {
  try {
    // if user exists, just sign in, otherwise register

    const user = await User.findOne({ email: req.body.email });
    if (user) {
      // already exists, same code as login
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pwd, ...rem } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rem);
    } else {
      // first make a pwd for user, and then similar to signup
      const genPwd =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const encryptPwd = bcryptjs.hashSync(genPwd, 10); // salt defaults to 10
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: encryptPwd,
        avatar: req.body.photo,
      });
      await newUser.save();
      // now login the newUser
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pwd, ...rem } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rem);
    }
  } catch (error) {
    next(error);
  }
};
