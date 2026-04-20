const request = require('supertest');
const db = require('./db');
const express = require('express');
const { authenticateToken } = require('./auth');

const app = express();
app.use(express.json());

// Mock DB implementation for test environment
jest.mock('./db', () => ({
  query: jest.fn(),
}));

app.post('/api/auth/register', (req, res) => res.status(201).json({ success: true }));
app.get('/api/dashboard', authenticateToken, (req, res) => res.json({ success: true, user: req.user }));

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn((token, secret, callback) => {
    if (token === 'valid.token') callback(null, { id: 1, username: 'testuser' });
    else callback(new Error('Invalid token'));
  }),
}));

describe('Auth & Dashboard Endpoints', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('denies access without token', async () => {
    const res = await request(app).get('/api/dashboard');
    expect(res.statusCode).toEqual(401);
  });

  it('accesses dashboard with valid token', async () => {
    const res = await request(app).get('/api/dashboard').set('Authorization', 'Bearer valid.token');
    expect(res.statusCode).toEqual(200);
    expect(res.body.user.username).toBe('testuser');
  });
});
