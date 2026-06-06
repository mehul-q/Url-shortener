const { createClient } = require('redis');
require('dotenv').config();

const client = createClient({ url: process.env.REDIS_URL });
client.on('error', err => console.error('Redis error:', err));
client.connect();

const TTL = 3600;

module.exports = {
  get: (code) => client.get(`url:${code}`),

  set: (code, url) => client.setEx(`url:${code}`, TTL, url),

  del: (code) => client.del(`url:${code}`),

  checkRateLimit: async (ip, limit = 10, windowSec = 60) => {
    const key = `rate:${ip}`;
    const count = await client.incr(key);
    if (count === 1) await client.expire(key, windowSec);
    return count <= limit;
  },
};