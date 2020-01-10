import request from 'supertest';
import setupDB from '../../../utils/test-setup';
import app from '../../../app';

// Setup a Test Database
setupDB('login-testing');

it('should handle login', async done => {
  await request(app)
    .post('/api/user/register')
    .send({
      username: 'ninjanuur',
      email: 'ninjanuur@gmail.com',
      password: 'ninjanuur01'
    })
    .expect(200);

  // Sad path
  const response = await request(app)
    .post('/api/user/login')
    .send({
      username: 'ninjanuur',
      email: 'ninjanuur@gmail.com',
      password: 'ninjanuur02'
    });
  expect(response.status).toEqual(400);

  // Happy path
  const res = await request(app)
    .post('/api/user/login')
    .send({
      username: 'ninjanuur',
      password: 'ninjanuur01'
    });
  expect(res.status).toEqual(200);
  done();
});
