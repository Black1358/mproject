import { object, string } from 'zod';
import { messages, passwordValidator } from '$lib/internal/validation';
export const LoginSchema = object({
	email: string().email({ message: messages.email }).min(4, { message: messages.min }).max(40, { message: messages.max }).nonempty(messages.required),
	password: passwordValidator
});

export const RegSchema = object({
	name: string().min(2, { message: messages.min }).nonempty(messages.required),
	email: string().email({ message: messages.email }).min(4, { message: messages.min }).max(40, { message: messages.max }).nonempty(messages.required),
	password: passwordValidator,
	passwordConfirm: string().nonempty(messages.required),
	referrer: string(),
}).superRefine(({ password, passwordConfirm }, ctx) => {
	if (password !== passwordConfirm) ctx.addIssue({ code: "custom", message: messages.passwordsMismatch, "path": ["passwordConfirm"] })}
);