import pgPromise from 'pg-promise';

const pgp = pgPromise();

const connection = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

console.log("Database connection settings:", connection);

const db = pgp(connection);

export default db;
