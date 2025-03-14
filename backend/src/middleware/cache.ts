// src/middleware/cache.ts
import { Request, Response, NextFunction } from 'express';
import { getCache, setCache } from '../services/redis';

export const cacheMiddleware = (prefix: string, expireSeconds = 3600) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `${prefix}:${req.originalUrl}`;
    const cachedData = await getCache(key);

    if (cachedData) {
      return res.json(cachedData);
    }

    const originalJson = res.json;
    res.json = function (data) {
      setCache(key, data, expireSeconds);
      return originalJson.call(this, data);
    };

    next();
  };
};