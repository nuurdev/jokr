/* eslint-disable consistent-return */
/* eslint-disable no-console */
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../../../model/user';
import {
  forgotPasswordValidation,
  resetPasswordValidation
} from './validation';

const router = express.Router();

// Forgot password
router.post('/forgot-password', async (req, res) => {
  const { error } = forgotPasswordValidation(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const token = crypto.randomBytes(20).toString('hex');
  const expires = Date.now() + 3600000;

  const { email } = req.body;

  const foundUser = await User.findOneAndUpdate(
    { email },
    {
      resetPasswordToken: token,
      resetPasswordExpires: expires
    },
    { new: true }
  );

  // Send email
  if (foundUser) {
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
      to: `${foundUser.email}`,
      subject: 'Reset password',
      text:
        'You have requested to reset your password.\n\n' +
        'Please click on the following link to complete the process.\n\n' +
        `${protocol}://${req.headers.host}/reset-password/${token}\n\n` +
        'If you did not request this, please ignore.\n'
    };

    transporter
      .sendMail(mailOptions)
      .then(() => res.status(200).send({ message: 'Reset password link sent' }))
      .catch(err => {
        // We could remove the users reset token here
        res.status(400).send({ message: 'Oops, unable to send email' });
        console.log(err);
      });
  } else {
    res.status(200).send({ message: 'Reset password link sent' });
  }
});

// Check if token is valid
router.get('/reset-password', async (req, res) => {
  const { token } = req.query;
  const foundUser = await User.findOne({
    resetPasswordToken: token
  }).select('+resetPasswordToken +resetPasswordExpires');

  const isValid =
    foundUser && new Date(`${foundUser.resetPasswordExpires}`) > new Date();

  return isValid
    ? res.status(200).send({ message: 'Valid token' })
    : res.status(400).send({ message: 'Invalid token' });
});

// Set new password
router.post('/reset-password', async (req, res) => {
  const { error } = resetPasswordValidation(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const { token, newPassword, newPasswordConfirm } = req.body;

  if (newPassword !== newPasswordConfirm) {
    return res.status(400).send({ message: 'Passwords do not match' });
  }

  const foundUser = await User.findOne({
    resetPasswordToken: token
  }).select('+resetPasswordToken +resetPasswordExpires');

  const isValid =
    foundUser && new Date(`${foundUser.resetPasswordExpires}`) > new Date();

  if (isValid) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findOneAndUpdate(
      { email: foundUser.email },
      {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      },
      { new: true }
    );
    res.status(200).send({ message: 'Password updated successfully' });
  } else {
    res.status(400).send({ message: 'Token no longer valid' });
  }
});
export default router;
