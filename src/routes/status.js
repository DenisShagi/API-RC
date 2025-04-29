import express from 'express'
import { db } from '../db.js'

export const statusRouter = express.Router();
//
statusRouter.get('/', async (req, res, next) => {
	try {
		const { rows } = await db.query(
			`SELECT count(*) as task_count, 
			(select created_at from event.events order by created_at desc limit 1) as task_last 
			FROM event.events`
		)
		res.json(rows[0])
	} catch (err) {
		next(err)
	}
})
