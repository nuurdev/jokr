/* eslint-disable no-console */
import crypto from 'crypto';
import express from 'express';
import nodemailer from 'nodemailer';
import User from '../../../model/user';
import verify from '../../../utils/verify-token';

const router = express.Router();

// Trigger email confirm email
router.post('/confirmation-email', verify, async (req, res) => {
  const token = crypto.randomBytes(20).toString('hex');
  const expires = Date.now() + 3600000;

  const { _id } = req.body.user;

  const user = await User.findOne({ _id });

  if (user.confirmed) {
    return res.status(200).send({ message: 'You are already confirmed' });
  }

  await user.updateOne({
    confirmEmailToken: token,
    confirmEmailExpires: expires
  });

  if (user) {
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

    return transporter
      .sendMail(mailOptions)
      .then(() =>
        res
          .status(200)
          .send({ message: 'Confirmation email sent, if email exists' })
      )
      .catch(err => {
        // We could remove the users reset token here
        console.error(`Unable to send email: ${err}`);
        return res.status(400).send({ message: 'Oops, unable to send email' });
      });
  }

  console.error(`Unable to find user`);
  return res
    .status(200)
    .send({ message: 'Confirmation email sent, if email exists' });
});

// Confirm email validate
router.post('/confirm-email', verify, async (req, res) => {
  const { _id } = req.body.user;
  const { token } = req.body;

  const foundUser = await User.findOne({
    _id: _id,
    confirmEmailToken: token
  });

  const isValid =
    foundUser && new Date(`${foundUser.confirmEmailExpires}`) > new Date();

  if (isValid) {
    await User.findOneAndUpdate(
      { _id },
      {
        confirmed: true,
        confirmEmailToken: null,
        confirmEmailExpires: null
      },
      { new: true }
    );
    return res.status(200).send({ message: 'Email confirmed' });
  }
  return res.status(400).send({ message: 'Invalid token' });
});

export default router;
