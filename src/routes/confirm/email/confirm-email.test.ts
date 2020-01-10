/* eslint-disable no-console */
import request from 'supertest';
import setupDB from '../../../utils/test-setup';
import User from '../../../model/user';
import app from '../../../app';

setupDB('confirm-email-testing');

jest.mock('nodemailer');

// No working with ES6 import
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer');

const sendMailMock = jest.fn(() => Promise.resolve({ data: 'data' }));
nodemailer.createTransport.mockReturnValue({
  sendMail: sendMailMock
});

it('should send confirmation email', async done => {
  const response = await request(app)
    .post('/api/user/register')
    .send({
      username: 'testuser',
      email: 'testuser@gmail.com',
      password: 'testpassword1'
    });

  const { token } = response.body;

  // Sad path
  await request(app)
    .post('/api/user/confirmation-email')
    .set('auth-token', 'invalid-token')
    .send();
  expect(sendMailMock).toHaveBeenCalledTimes(0);

  // Happy path
  const res = await request(app)
    .post('/api/user/confirmation-email')
    .set('auth-token', token)
    .send();
  expect(res.status).toEqual(200);
  expect(sendMailMock).toHaveBeenCalledTimes(1);
  done();
});

it('should confirm user', async done => {
  const response = await request(app)
    .post('/api/user/register')
    .send({
      username: 'testuser',
      email: 'testuser@gmail.com',
      password: 'testpassword1'
    });

  const { token } = response.body;

  await request(app)
    .post('/api/user/confirmation-email')
    .set('auth-token', token)
    .send();

  const updatedUser = await User.findOne({
    email: 'testuser@gmail.com'
  });

  const { confirmEmailToken } = updatedUser;

  await request(app)
    .post('/api/user/confirm-email')
    .set('auth-token', token)
    .send({ token: confirmEmailToken })
    .expect(200);

  const finalUser = await User.findOne({
    email: 'testuser@gmail.com'
  });

  expect(finalUser.confirmed).toEqual(true);
  expect(finalUser.confirmEmailToken).toEqual(null);
  expect(finalUser.confirmEmailExpires).toEqual(null);
  done();
});
