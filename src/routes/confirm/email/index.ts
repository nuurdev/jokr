/* eslint-disable no-console */
import crypto from 'crypto';
import express from 'express';
import nodemailer from 'nodemailer';
import User from '../../../model/user';
import verify from '../../../utils/verify-token';

const router = express.Router();

router.post(
  '/confirmation-email',
  verify,
  async (req, res): Promise<void> => {
    const token = crypto.randomBytes(20).toString('hex');
    const expires = Date.now() + 3600000;

    const { _id } = req.body.user;
    const user = await User.findOne({ _id });

    if (!user) {
      console.error(`Unable to find user`);
      res.status(400).send({ message: 'No account found with that email' });
      return;
    }

    if (user.confirmed) {
      res.status(400).send({ message: 'Email already confirmed' });
      return;
    }

    const updatedUser = await user.updateOne({
      confirmEmailToken: token,
      confirmEmailExpires: expires
    });

    if (!updatedUser) {
      res.status(400).send({ message: 'Oops something went wrong' });
      return;
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
        `${protocol}://${req.headers.host}/confirm-email/${token}\n\n` +
        'If you did not request this, please ignore.\n'
    };

    transporter
      .sendMail(mailOptions)
      .then(() => res.status(200).send({ message: 'Confirmation email sent' }))
      .catch(err => {
        // We could remove the users reset token here
        console.error(`Unable to send email: ${err}`);
        res.status(400).send({ message: 'Oops, unable to send email' });
      });
  }
);

router.post(
  '/confirm-email',
  async (req, res): Promise<void> => {
    const { token } = req.body;

    const foundUser = await User.findOne({
      confirmEmailToken: token
    }).select('+confirmEmailToken +confirmEmailExpires');

    if (!foundUser) {
      console.error('User not found');
      res.status(400).send({ message: 'User not found' });
      return;
    }

    const isExpired = new Date(`${foundUser.confirmEmailExpires}`) < new Date();

    if (isExpired) {
      res.status(400).send({ message: 'Token expired' });
      return;
    }

    const updatedUser = await foundUser.updateOne({
      confirmed: true,
      confirmEmailToken: null,
      confirmEmailExpires: null
    });

    if (!updatedUser) {
      res.status(400).send({ message: 'Oops something went wrong' });
      return;
    }

    res.status(200).send({ message: 'Email confirmed' });
  }
);

export default router;
