/* eslint-disable no-underscore-dangle */
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../../model/User';
// import verify from './verifyToken';
import { registerValidation } from './validation';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const { username, email, password } = req.body;

  const usernameExists = await User.findOne({ username });
  if (usernameExists)
    return res.status(400).send({ message: 'Username already exists' });

  const emailExists = await User.findOne({ email });
  if (emailExists)
    return res.status(400).send({ message: 'Email already exists' });

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    username: username,
    email: email,
    password: hashedPassword
  });

  try {
    const savedUser = await user.save();
    const token = jwt.sign({ _id: savedUser._id }, process.env.TOKEN_SECRET);

    return res.send({ user, token });
  } catch (err) {
    return res.status(400).send({ message: err });
  }
});

export default router;
