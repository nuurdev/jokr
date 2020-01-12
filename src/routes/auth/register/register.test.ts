import request from 'supertest';
import setupDB from '../../../utils/test-setup';
import User from '../../../model/user';
import app from '../../../app';
import { registerReq } from '../../../utils/test-data';

setupDB('register-testing');

describe('/api/user/register', () => {
  it('should save user to database', async done => {
    const { username, email } = registerReq;

    const res = await request(app)
      .post('/api/user/register')
      .send({ ...registerReq });

    const user = await User.findOne({
      email
    });

    expect(user.username).toBeTruthy();
    expect(user.email).toBeTruthy();

    expect(res.body.user.username).toEqual(username);
    expect(res.body.user.email).toEqual(email);
    expect(res.body.user.isAdmin).toEqual(false);
    expect(res.body.user.confirmed).toEqual(false);
    expect(res.body.user.resetPasswordToken).toBeFalsy();
    expect(res.body.user.resetPasswordExpires).toBeFalsy();
    done();
  });

  it('should return error for invalid username', async done => {
    await request(app)
      .post('/api/user/register')
      .send({ ...registerReq, username: 'invalid!' })
      .expect(400);
    done();
  });

  it('should return error for invalid email', async done => {
    await request(app)
      .post('/api/user/register')
      .send({ ...registerReq, email: 'invalid!' })
      .expect(400);
    done();
  });

  it('should return error for invalid password', async done => {
    await request(app)
      .post('/api/user/register')
      .send({ ...registerReq, password: 'invalid!' })
      .expect(400);
    done();
  });
});
