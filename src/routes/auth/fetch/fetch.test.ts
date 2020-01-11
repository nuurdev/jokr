/* eslint-disable no-console */
import request from 'supertest';
import app from '../../../app';
import setupDB from '../../../utils/test-setup';
import { registerReq } from '../../../utils/test-data';

setupDB('fetch-user-testing');

describe('/api/user/fetch', () => {
  it('should fetch user', async done => {
    const response = await request(app)
      .post('/api/user/register')
      .send({ ...registerReq });

    const { token } = response.body;

    await request(app)
      .get('/api/user/profile')
      .set('auth-token', token)
      .send()
      .expect(200);
    done();
  });

  it('should not fetch user', async done => {
    await request(app)
      .get('/api/user/profile')
      .set('auth-token', 'invalid-token')
      .send()
      .expect(401);
    done();
  });
});
