const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('ALTER TABLE "PartnerApplication" ADD COLUMN "collection" TEXT;')
  .then(() => {
    console.log('Added column');
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
    process.exit(0);
  });
