import Joi from 'joi'

export const eventSchema = Joi.object({
	fullName: Joi.string()
		.pattern(/^[А-ЯЁа-яё\s-]{3,200}$/)
		.required(),
	reason: Joi.string().trim().min(3).max(200).required(),
	phone: Joi.string()
		.pattern(/^\+7\d{10}$/)
		.required(),
	message: Joi.string().trim().min(3).max(2000).required(),
	status: Joi.string()
		.valid('new', 'in_progress', 'done', 'rejected')
		.default('new'),
})
