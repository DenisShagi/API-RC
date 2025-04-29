import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { eventsRouter } from './routes/events.js'
import { statusRouter } from './routes/status.js'
import { db } from './db.js'

dotenv.config()
const PORT = process.env.PORT || 5000

const app = express()

/* ---------- middleware ---------- */
app.use(helmet())
app.use(express.json())
// app.use(
// 	cors({
// 		origin: ['https://ваш-фронт.домен', 'https://www.ваш-фронт.домен'],
// 	})
// )
app.use(cors());
app.use(morgan('combined'))

// 100 POST'ов за 15 мин с одного IP
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
})

/* ---------- routes ---------- */
app.get('/health', (_, res) => res.send('ok'))
app.use('/api/event', apiLimiter, eventsRouter)
app.use('/api/status', apiLimiter, statusRouter)

/* ---------- error handler ---------- */
app.use((err, _req, res, _next) => {
	console.error(err)
	res.status(500).json({ ok: false, error: 'internal error' })
})

/* ---------- start ---------- */
app.listen(PORT, () => console.log(`API on ${PORT}`))

process.on('SIGTERM', () => db.end(() => process.exit(0)))
process.on('SIGINT', () => db.end(() => process.exit(0)))
