import dotenv from 'dotenv'
import pkg from 'pg'
dotenv.config()

const { Pool } = pkg

export const db = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl:
		process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
})
db.on('error', e => console.error('PG-Pool error', e))
