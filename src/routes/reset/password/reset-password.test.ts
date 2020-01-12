/* eslint-disable no-console */
import request from 'supertest';
import setupDB from '../../../utils/test-setup';
import User from '../../../model/user';
import app from '../../../app';
import {
  registerReq,
  resetPasswordReq,
  loginReq
} from '../../../utils/test-data';

setupDB('reset-password-testing');

jest.mock('nodemailer');

// No working with ES6 import
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer');

const sendMailMock = jest.fn(() => Promise.resolve({ data: 'data' }));
nodemailer.createTransport.mockReturnValue({
  sendMail: sendMailMock
});

describe('/api/user/reset-password', () => {
  it('should send reset email', async done => {
    const user = new User({ ...registerReq });
    const savedUser = await user.save();

    await request(app)
      .post('/api/user/forgot-password')
      .send({
        email: savedUser.email
      });
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    done();
  });

  it('should not send reset email', async done => {
    await request(app)
      .post('/api/user/forgot-password')
      .send({
        ...registerReq,
        email: 'invalid!'
      })
      .expect(400);
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    done();
  });

  it('should pass token verification', async done => {
    const user = new User({ ...registerReq });
    const savedUser = await user.save();

    await request(app)
      .post('/api/user/forgot-password')
      .send({
        email: savedUser.email
      });

    const userWithToken = await User.findOne({
      email: savedUser.email
    });
    const token = userWithToken.resetPasswordToken;

    await request(app)
      .get(`/api/user/reset-password?token=${token}`)
      .expect(200);
    done();
  });

  it('should fail token verification', async done => {
    const user = new User({ ...registerReq });
    const savedUser = await user.save();
    const emptyToken = savedUser.resetPasswordToken;

    await request(app)
      .get(`/api/user/reset-password?token=${emptyToken}`)
      .send({
        email: savedUser.email
      })
      .expect(400);
    done();
  });

  it('should set new password', async done => {
    const user = new User({ ...registerReq });
    const savedUser = await user.save();

    await request(app)
      .post('/api/user/forgot-password')
      .send({
        email: savedUser.email
      });

    const userWithToken = await User.findOne({
      email: savedUser.email
    });
    const token = userWithToken.resetPasswordToken;

    await request(app)
      .post('/api/user/reset-password')
      .send({
        ...resetPasswordReq,
        token: token
      })
      .expect(200);

    await request(app)
      .post('/api/user/login')
      .send({
        ...loginReq,
        password: resetPasswordReq.newPassword
      })
      .expect(200);
    done();
  });

  it('should decline old password', async done => {
    const user = new User({ ...registerReq });
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

    await request(app)
      .post('/api/user/reset-password')
      .send({
        ...resetPasswordReq,
        token: token
      });

    await request(app)
      .post('/api/user/login')
      .send({ ...loginReq })
      .expect(400);
    done();
  });

  it('should not set a new password', async done => {
    const user = new User({ ...registerReq });
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

    await request(app)
      .post('/api/user/reset-password')
      .send({
        newPassword: 'newpassword1',
        newPasswordConfirm: 'newpassword2',
        token: token
      })
      .expect(400);
    done();
  });
});

// Should not be able to use same token to reset password twice
