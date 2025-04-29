import express from 'express'
import Joi from 'joi'
import { db } from '../db.js'
import { eventSchema } from '../validators.js'

export const eventsRouter = express.Router()

/* ---------- POST  /api/event ---------- */
eventsRouter.post('/', async (req, res, next) => {
	try {
		const { error, value } = eventSchema.validate(req.body, {
			abortEarly: false,
		})
		if (error) return res.status(400).json({ ok: false, error: error.message })

		const { fullName, reason, phone, message } = value

		/* status берётся из DEFAULT 'new' в таблице */
		await db.query(
			`INSERT INTO event.events (full_name, reason, phone, message)
       VALUES ($1, $2, $3, $4)`,
			[fullName, reason, phone, message]
		)

		res.json({ ok: true })
	} catch (err) {
		next(err)
	}
})

/* ---------- GET  /api/event?limit&offset ---------- */
eventsRouter.get('/', async (req, res, next) => {
	try {
		const limit = Math.min(parseInt(req.query.limit) || 20, 100)
		const offset = Math.max(parseInt(req.query.offset) || 0, 0)

		const { rows } = await db.query(
			`SELECT id,
              full_name AS "fullName",
              reason,
              phone,
              message,
              status,                      -- <-- теперь приходит на фронт
              created_at AS "createdAt"
         FROM event.events
     ORDER BY id DESC
        LIMIT $1 OFFSET $2`,
			[limit, offset]
		)

		res.json(rows)
	} catch (err) {
		next(err)
	}
})

/* ---------- PATCH /api/event/:id/status ---------- */
eventsRouter.patch('/:id/status', async (req, res, next) => {
	try {
		const id = Number(req.params.id)

		const { error, value } = Joi.object({
			status: Joi.string()
				.valid('new', 'in_progress', 'done', 'rejected')
				.required(),
		}).validate(req.body)

		if (error) return res.status(400).json({ ok: false, error: error.message })

		const { status } = value

		const { rowCount } = await db.query(
			'UPDATE event.events SET status = $1 WHERE id = $2',
			[status, id]
		)

		if (!rowCount)
			return res.status(404).json({ ok: false, error: 'not found' })

		res.json({ ok: true })
	} catch (err) {
		next(err)
	}
})
