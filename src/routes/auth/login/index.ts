/* eslint-disable no-underscore-dangle */
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../../../model/user';
import loginValidation from './validation';

const router = express.Router();

router.post('/login', async (req, res) => {
  // May want to bypass this for admin usernames
  // could put this in try catch block
  const { error } = loginValidation(req.body);
  if (error)
    return res.status(400).send({ message: 'Incorrect username or password.' });
  // Check if email exists
  const user = await User.findOne({ username: req.body.username }).select(
    '+password'
  );
  if (!user)
    return res.status(400).send({ message: 'Incorrect username or password.' });
  // Check if password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res.status(400).send({ message: 'Incorrect username or password.' });
  // Create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  return res.header('auth-token', token).send({ user, token });
});

export default router;
