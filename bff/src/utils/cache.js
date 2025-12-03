import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});

export const cache = {
  get: async (key) => {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },
  set: async (key, value, ttlSeconds = 60) => {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  },
  del: async (key) => {
    await redis.del(key);
  },
};

export default cache;
