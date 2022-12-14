export default {
  DEBUG: process.env.DEBUG === "true",
  LOG_LEVEL: process.env.LOG_LEVEL,
  ENVIRONMENT: process.env.ENVIRONMENT,
  PORT: parseInt(process.env.PORT, 10) || 3000,
  METRICS_PREFIX: process.env.METRICS_PREFIX,
  NAME: process.env.NAME,
  MONGO_DATABASE_URI: process.env.MONGO_DATABASE_URI,
  MY_SQL_DATABASE: {
    HOST: process.env.MYSQL_HOST,
    PORT: parseInt(process.env.MYSQL_PORT || "3306", 10),
    USER: process.env.MYSQL_USER,
    PASSWORD: process.env.MYSQL_PASSWORD,
    DATABASE: process.env.MYSQL_DATABASE,
  },
};
