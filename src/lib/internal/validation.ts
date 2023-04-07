import { string } from 'zod'

export type ValidationResult = {[key: string]: string};
export const messages = {
	required: 'Обязательно',
	min: 'Коротко',
	email: 'Некорректно',
	passwordsMismatch: 'Не совпадают',
	passwordMin: 'Менее 8 символов',
	max: 'Более 40 символов',
	passwordUppercase: 'Нет заглавной буквы',
	passwordLowercase: 'Нет строчной буквы',
	passwordNumber: 'Нет цифр',
	passwordNoDate: 'Обнаружена дата',
	passwordNoConsecutiveDigits: '5 цифр подряд',
};

export const passwordValidator = string()
	.min(8, { message: messages.passwordMin })
	.max(40, { message: messages.max })
	.regex(/[A-Z]/, { message: messages.passwordUppercase })
	.regex(/[a-z]/, { message: messages.passwordLowercase })
	.regex(/[0-9]/, { message: messages.passwordNumber }).nonempty(messages.required)
	.refine(value => !/\d{1,4}[-/.]\d{1,2}[-/.]\d{1,4}/.test(value), { message: messages.passwordNoDate })
	.refine(value => !/\d{6,}/.test(value), { message: messages.passwordNoConsecutiveDigits });