import 'dotenv/config';

export default {
  DATABASE_URL: process.env.DATABASE_TEST_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY_DURATION: process.env.JWT_EXPIRY_DURATION,
  PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
};
