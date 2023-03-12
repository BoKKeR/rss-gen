const env = {
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_PORT: parseInt(process.env.REDIS_PORT),
  REDIS_ENV: process.env.REDIS_ENV,
  REDIS_USER: process.env.REDIS_USER ? process.env.REDIS_USER : "default",
  REDIS_MUTEX: process.env.REDIS_MUTEX,
  BASE_URL: process.env.VERCEL_URL
    ? process.env.VERCEL_URL
    : "http://localhost:4000"
};

const redisString = `redis://${env.REDIS_USER}:${env.REDIS_PASSWORD}@${env.REDIS_HOST}:${env.REDIS_PORT}`;

export default { env, redisString };
