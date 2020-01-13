/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import User from '../../../model/user';
import registerValidation from './validation';

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

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const confirmEmailToken = crypto.randomBytes(20).toString('hex');
  const expires = Date.now() + 3600000;

  const user = new User({
    username: username,
    email: email,
    password: hashedPassword,
    confirmEmailToken: confirmEmailToken,
    confirmEmailExpires: expires
  });

  try {
    const savedUser = await user.save();
    const token = jwt.sign({ _id: savedUser._id }, process.env.TOKEN_SECRET);
    res.status(201).send({ user, token });
  } catch (err) {
    console.log(`unable to save user: ${err}`);
    return res.status(400).send({ message: err });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: `${process.env.EMAIL_ADDRESS}`,
      pass: `${process.env.EMAIL_PASSWORD}`
    }
  });

  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

  const mailOptions = {
    from: 'nuurdev.testing@gmail.com',
    to: `${user.email}`,
    subject: 'Confirm email address',
    text:
      'Please confirm your email address.\n\n' +
      'Please click on the following link to complete the process.\n\n' +
      `${protocol}://${req.headers.host}/confirm-email/${confirmEmailToken}\n\n` +
      'If you did not request this, please ignore.\n'
  };

  return transporter
    .sendMail(mailOptions)
    .then(() => console.log('Email sent successfully'))
    .catch(err => console.log(`Unable to send email: ${err}`));
});

export default router;
