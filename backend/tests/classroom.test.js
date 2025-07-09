import request from 'supertest';
import app from '../app.js';

describe('GET /api/classroom/:roomId/history', () => {
  it('should return classroom history', async () => {
    const res = await request(app).get('/api/classroom/testroom/history');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('roomId', 'testroom');
    expect(res.body).toHaveProperty('logs');
    expect(Array.isArray(res.body.logs)).toBe(true);
  });
}); 