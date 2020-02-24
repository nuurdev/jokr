/* eslint-disable no-underscore-dangle */
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../../../model/user';
import loginValidation from './validation';

const router = express.Router();

router.post(
  '/login',
  async (req, res): Promise<void> => {
    const { error } = loginValidation(req.body);
    if (error) {
      res.status(400).send({ message: 'Incorrect username or password.' });
      return;
    }

    const user = await User.findOne({ username: req.body.username }).select(
      '+password'
    );
    if (!user) {
      res.status(400).send({ message: 'Incorrect username or password.' });
      return;
    }

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      res.status(400).send({ message: 'Incorrect username or password.' });
      return;
    }

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send({ user, token });
  }
);

export default router;
