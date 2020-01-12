import request from 'supertest';
import setupDB from '../../../utils/test-setup';
import app from '../../../app';
import { registerReq, loginReq } from '../../../utils/test-data';

setupDB('login-testing');

describe('/api/user/login', () => {
  it('should login user', async done => {
    await request(app)
      .post('/api/user/register')
      .send({ ...registerReq })
      .expect(201);

    await request(app)
      .post('/api/user/login')
      .send({ ...loginReq })
      .expect(200);
    done();
  });
  it('should not login user', async done => {
    await request(app)
      .post('/api/user/login')
      .send({ ...loginReq, password: 'incorrectpassword' })
      .expect(400);
    done();
  });
});
