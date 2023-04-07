import { object, string } from 'zod'
import { messages } from '$lib/internal/validation'

export const PartnerSchema = object({
	contactEmail: string().email({ message: messages.email }).min(4, { message: messages.min }).max(40, { message: messages.max }).nonempty(messages.required),
	contactSurname: string().min(2, { message: messages.min }).nonempty(messages.required),
	contactName: string().min(2, { message: messages.min }).nonempty(messages.required),
	contactPatronymic: string(),
});