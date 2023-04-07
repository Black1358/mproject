import { object, string } from 'zod';
import { messages } from '$lib/internal/validation';

export const userSchema = object({
	avatar: string().url().optional(),
	surname: string().min(2, { message: messages.min }).nonempty(messages.required),
	name: string().min(2, { message: messages.min }).nonempty(messages.required),
	patronymic: string(),
	phone: string().min(6, { message: messages.min }).nonempty(messages.required),
});