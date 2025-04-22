// index.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config() // подтянем .env, если он есть

// PORT=5000 в .env или 5000 по дефолту
const PORT = process.env.PORT || 5000

const app = express()

/* ---------- middleware ---------- */
app.use(express.json())

// CORS: пока разрешаем всё. Перед продом ограничьте origin!
app.use(
	cors({
		origin: '*', // ← dev-режим. В проде: ['https://your-site.com']
	})
)

/* ---------- healthcheck ---------- */
app.get('/health', (_, res) => {
	res.send('ok')
})

/* ---------- POST /api/event ---------- */
app.post('/api/event', (req, res) => {
	const { fullName, reason, phone, message } = req.body || {}

	// простейшая валидация
	if (!fullName || !reason || !phone || !message) {
		return res.status(400).json({ ok: false, error: 'all fields required' })
	}
	if (!/^\+?\d{10,15}$/.test(phone)) {
		return res.status(400).json({ ok: false, error: 'invalid phone' })
	}

	/* TODO: здесь будет запись в БД / e‑mail / webhook.
           Пока просто печатаем. */
	console.log('NEW EVENT:', { fullName, reason, phone, message })

	return res.json({ ok: true })
})

/* ---------- запуск ---------- */
app.listen(PORT, () => {
	console.log(`API listening on http://localhost:${PORT}`)
})
