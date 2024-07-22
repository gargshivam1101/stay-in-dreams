import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
  // some code
  console.log(req.body);
  const { username, email, password } = req.body;
  const encryptPwd = bcryptjs.hashSync(password, 10); // salt defaults to 10
  const newUser = new User({ username, email, password: encryptPwd });
  try {
    await newUser.save();
    res.status(201).json("Success");
  } catch (err) {
    res.status(500).json(err);
  }
};
