// src/services/redis.ts
import Redis from 'ioredis';

const redis = new Redis({
    host: process.env.REDIS_HOST?.replace('rediss://', '') || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    tls: {
      rejectUnauthorized: false
    },
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 5
  });

redis.on('error', (err) => console.error('Redis Client Error', err));
redis.on('connect', () => console.log('Redis Client Connected'));

export const getCache = async (key: string) => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis Get Error:', error);
    return null;
  }
};

export const setCache = async (key: string, value: any, expireSeconds = 3600) => {
  try {
    await redis.set(key, JSON.stringify(value), 'EX', expireSeconds);
    return true;
  } catch (error) {
    console.error('Redis Set Error:', error);
    return false;
  }
};

export const deleteCache = async (key: string) => {
  try {
    await redis.del(key);
    return true;
  } catch (error) {
    console.error('Redis Delete Error:', error);
    return false;
  }
};

export const clearCache = async (pattern: string) => {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    return true;
  } catch (error) {
    console.error('Redis Clear Error:', error);
    return false;
  }
};

export default redis;