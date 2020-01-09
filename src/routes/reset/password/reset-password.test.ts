/* eslint-disable no-console */
import request from 'supertest';
import setupDB from '../../../utils/test-setup';
import User from '../../../model/user';
import app from '../../../app';

setupDB('reset-password-testing');

jest.mock('nodemailer');

// No working with ES6 import
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer');

const sendMailMock = jest.fn(() => Promise.resolve({ data: 'data' }));
nodemailer.createTransport.mockReturnValue({
  sendMail: sendMailMock
});

it('should send reset email', async done => {
  // Sad path
  await request(app)
    .post('/api/user/forgot-password')
    .send({
      email: 'non-existent@gmail.com'
    });
  expect(sendMailMock).toHaveBeenCalledTimes(0);

  // Happy path
  const user = new User({
    username: 'testuser',
    email: 'testuser@gmail.com',
    password: 'testpassword1'
  });

  const savedUser = await user.save();

  await request(app)
    .post('/api/user/forgot-password')
    .send({
      email: savedUser.email
    });
  expect(sendMailMock).toHaveBeenCalledTimes(1);

  // Check that the token exists on the User model
  const updatedUser = await User.findOne({
    email: savedUser.email
  });
  expect(updatedUser.resetPasswordToken).toBeTruthy();
  expect(updatedUser.resetPasswordExpires).toBeTruthy();
  done();
});

it('should verify token', async done => {
  const user = new User({
    username: 'testuser',
    email: 'testuser@gmail.com',
    password: 'testpassword1'
  });

  const savedUser = await user.save();

  // Sad path - No token associated with user yet
  const emptyToken = savedUser.resetPasswordToken;
  const response = await request(app)
    .get(`/api/user/reset-password?token=${emptyToken}`)
    .send({
      email: savedUser.email
    });
  expect(response.status).toEqual(400);

  // Happy path
  await request(app)
    .post('/api/user/forgot-password')
    .send({
      email: savedUser.email
    });

  const updatedUser = await User.findOne({
    email: savedUser.email
  });

  const token = updatedUser.resetPasswordToken;
  const res = await request(app).get(`/api/user/reset-password?token=${token}`);
  expect(res.status).toEqual(200);
  done();
});

it('should set new password', async done => {
  const user = new User({
    username: 'testuser',
    email: 'testuser@gmail.com',
    password: 'oldpassword1'
  });

  const savedUser = await user.save();

  await request(app)
    .post('/api/user/forgot-password')
    .send({
      email: savedUser.email
    });

  const updatedUser = await User.findOne({
    email: savedUser.email
  });

  const token = updatedUser.resetPasswordToken;

  // Sad path
  const response = await request(app)
    .post('/api/user/reset-password')
    .send({
      newPassword: 'newpassword1',
      newPasswordConfirm: 'newpassword2',
      token: token
    });
  expect(response.status).toEqual(400);

  const res = await request(app)
    .post('/api/user/reset-password')
    .send({
      newPassword: 'newpassword1',
      newPasswordConfirm: 'newpassword1',
      token: token
    });
  expect(res.status).toEqual(200);

  const latestUser = await User.findOne({
    email: savedUser.email
  });

  expect(latestUser.resetPasswordToken).toBeFalsy();
  expect(latestUser.resetPasswordExpires).toBeFalsy();
  done();
});
