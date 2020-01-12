/* eslint-disable no-console */
import request from 'supertest';
import setupDB from '../../../utils/test-setup';
import User from '../../../model/user';
import app from '../../../app';
import { registerReq } from '../../../utils/test-data';

setupDB('confirm-email-testing');

jest.mock('nodemailer');

// No working with ES6 import
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer');

const sendMailMock = jest.fn(() => Promise.resolve({ data: 'data' }));
nodemailer.createTransport.mockReturnValue({
  sendMail: sendMailMock
});

describe('/api/user/confirm-email', () => {
  it('should send confirmation email', async done => {
    const response = await request(app)
      .post('/api/user/register')
      .send({ ...registerReq });

    const { token } = response.body;

    await request(app)
      .post('/api/user/confirmation-email')
      .set('auth-token', token)
      .send()
      .expect(200);
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    done();
  });

  it('should not send confirmation email', async done => {
    await request(app)
      .post('/api/user/confirmation-email')
      .set('auth-token', 'invalid-token')
      .send()
      .expect(401);
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    done();
  });

  it('should confirm user', async done => {
    const response = await request(app)
      .post('/api/user/register')
      .send({ ...registerReq });

    const { token } = response.body;

    await request(app)
      .post('/api/user/confirmation-email')
      .set('auth-token', token)
      .send();

    const user = await User.findOne({
      email: registerReq.email
    });

    const { confirmEmailToken } = user;

    await request(app)
      .post('/api/user/confirm-email')
      .set('auth-token', token)
      .send({ token: confirmEmailToken })
      .expect(200);

    const updatedUser = await User.findOne({
      email: registerReq.email
    });

    expect(updatedUser.confirmed).toEqual(true);
    expect(updatedUser.confirmEmailToken).toEqual(null);
    expect(updatedUser.confirmEmailExpires).toEqual(null);
    done();
  });
});

// If user is confirmed, should not send confirmation email
