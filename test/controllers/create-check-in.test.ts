import { prisma } from '@/lib/prisma';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../../src/app';
import { createAndAuthenticatedUser } from './utils/create-and-authenticate-user';

describe('Create Check-In e2e', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticatedUser(app);

    const gym = await prisma.gym.create({
      data: {
        name: 'Academia do JavaScript',
        latitude: -23.5505199,
        longitude: -46.6333094,
      }
    })

    const response = await request(app.server)
      .post(`/check-ins/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -23.5505199,
        longitude: -46.6333094,
      });
    expect(response.status).toBe(201);
  });
});
