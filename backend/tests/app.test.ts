import request from 'supertest';
import  app  from '../src/index';
import  db  from '../src/db/index';
import { users, cortex } from '../src/db/schema';
import jwt from 'jsonwebtoken';
import { expect } from 'chai';

describe('Auth Endpoints', () => {
  beforeEach(async () => {
    // Clear the test database before each test
    await db.delete(users);
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('token');
    });

    it('should not register user with existing email', async () => {
      // First registration
      await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      // Second registration with same email
      const res = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.status).to.equal(400);
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Create a test user before each login test
      await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
    });

    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('token');
    });

    it('should not login with incorrect password', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(res.status).to.equal(401);
    });
  });
});

describe('Cortex Endpoints', () => {
  let authToken: string;
  let userId: string;

  beforeEach(async () => {
    // Clear the test database
    await db.delete(cortex);
    await db.delete(users);

    // Create a test user and get token
    const registerRes = await request(app)
      .post('/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = registerRes.body.token;
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET!) as { id: string };
    userId = decoded.id;
  });

  describe('GET /cortex', () => {
    it('should get user cortex items', async () => {
      // Create a test cortex item first
      await db.insert(cortex).values({
        userId,
        type: 'article',
        title: 'Test Article',
        description: 'Test Description',
        link: 'https://test.com',
        isPublic: false
      });

      const res = await request(app)
        .get('/cortex')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.cortexes).to.be.an('array');
      expect(res.body.cortexes[0]).to.have.property('title', 'Test Article');
    });

    it('should not get cortex items without auth', async () => {
      const res = await request(app).get('/cortex');
      expect(res.status).to.equal(401);
    });
  });

  describe('POST /cortex', () => {
    it('should create a new cortex item', async () => {
      const res = await request(app)
        .post('/cortex')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'article',
          title: 'New Article',
          description: 'New Description',
          link: 'https://example.com',
          isPublic: false
        });

      expect(res.status).to.equal(201);
      expect(res.body.cortex).to.have.property('title', 'New Article');
    });

    it('should not create cortex item without required fields', async () => {
      const res = await request(app)
        .post('/cortex')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'article'
          // missing title and link
        });

      expect(res.status).to.equal(400);
    });
  });

  describe('GET /cortex/search', () => {
    beforeEach(async () => {
      // Create test cortex items for search
      await db.insert(cortex).values([
        {
          userId,
          type: 'article',
          title: 'React Hooks',
          description: 'Learn about React Hooks',
          link: 'https://react.dev',
          isPublic: false
        },
        {
          userId,
          type: 'article',
          title: 'TypeScript Guide',
          description: 'Complete TypeScript tutorial',
          link: 'https://typescript.org',
          isPublic: false
        }
      ]);
    });

    it('should search cortex items', async () => {
      const res = await request(app)
        .get('/cortex/search')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ query: 'React' });

      expect(res.status).to.equal(200);
      expect(res.body.result).to.be.an('array');
      expect(res.body.result[0]).to.have.property('title', 'React Hooks');
    });
  });
});