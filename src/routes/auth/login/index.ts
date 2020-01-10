/* eslint-disable no-underscore-dangle */
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../../../model/user';
import loginValidation from './validation';

const router = express.Router();

router.post('/login', async (req, res) => {
  // May want to bypass this for admin usernames
  const { error } = loginValidation(req.body);
  if (error) {
    return res
      .status(400)
      .send({ message: "Sorry, that email or password didn't work" });
  }

  // Check if email exists
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res
      .status(400)
      .send({ message: "Sorry, that email or password didn't work. no user" });
  }

  // Check if password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) {
    return res
      .status(400)
      .send({ message: "Sorry, that email or password didn't work." });
  }

  // Create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  return res.header('auth-token', token).send({ user, token });
});

export default router;
