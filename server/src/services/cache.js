const Redis = require('ioredis');
require('dotenv').config();

const client = new Redis(process.env.REDIS_URL, {
  tls: { rejectUnauthorized: false },
  maxRetriesPerRequest: 3,
  enableReadyCheck: false,
  lazyConnect: true,
});

client.on('error', err => console.error('Redis error:', err));

const TTL = 3600;

module.exports = {
  get: (code) => client.get(`url:${code}`),

  set: (code, url) => client.set(`url:${code}`, url, 'EX', TTL),

  del: (code) => client.del(`url:${code}`),

  checkRateLimit: async (ip, limit = 10, windowSec = 60) => {
    const key = `rate:${ip}`;
    const count = await client.incr(key);
    if (count === 1) await client.expire(key, windowSec);
    return count <= limit;
  },
};