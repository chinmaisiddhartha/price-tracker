export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'price_tracker',
    },
    moralis: {
      apiKey: process.env.MORALIS_API_KEY,
    },
    email: {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT, 10) || 587,
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  alertEmail: process.env.ALERT_EMAIL || 'hyperhire_assignment@hyperhire.in',
  });
  