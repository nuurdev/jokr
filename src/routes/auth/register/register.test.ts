import request from 'supertest';
import setupDB from '../../../utils/test-setup';
import User from '../../../model/user';
import app from '../../../app';

// Setup a Test Database
setupDB('register-testing');

it('should save user to database', async done => {
  const res = await request(app)
    .post('/api/user/register')
    .send({
      username: 'ninjanuur',
      email: 'ninjanuur@gmail.com',
      password: 'ninjanuur01'
    });

  // Searches the user in the database
  const user = await User.findOne({
    email: 'ninjanuur@gmail.com'
  });

  expect(user.username).toBeTruthy();
  expect(user.email).toBeTruthy();

  // Check the response
  expect(res.body.user.username).toEqual('ninjanuur');
  expect(res.body.user.email).toEqual('ninjanuur@gmail.com');
  expect(res.body.user.isAdmin).toEqual(false);
  expect(res.body.user.confirmed).toEqual(false);
  expect(res.body.user.resetPasswordToken).toBeFalsy();
  expect(res.body.user.resetPasswordExpires).toBeFalsy();
  done();
});

it('should return error for invalid username', async done => {
  const res = await request(app)
    .post('/api/user/register')
    .send({
      username: 'ninja',
      email: 'ninjanuur@gmail.com',
      password: 'ninjanuur01'
    });

  // Check the response
  expect(res.status).toEqual(400);
  expect(res.body.message).toBeTruthy();
  done();
});

it('should return error for invalid email', async done => {
  const res = await request(app)
    .post('/api/user/register')
    .send({
      username: 'ninjanuur',
      email: 'ninjanuur',
      password: 'ninjanuur01'
    });

  // Check the response
  expect(res.status).toEqual(400);
  expect(res.body.message).toBeTruthy();
  done();
});

it('should return error for invalid password', async done => {
  const res = await request(app)
    .post('/api/user/register')
    .send({
      username: 'ninjanuur',
      email: 'ninjanuur@gmail.com',
      password: 'ninjanuur'
    });

  // Check the response
  expect(res.status).toEqual(400);
  expect(res.body.message).toBeTruthy();
  done();
});
