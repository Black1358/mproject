import {error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
const findReferrer = async (locals: App.Locals, referrer: string) => {
	try {
		await locals.pb.collection('users').getOne(referrer, {});
	} catch (err) {
		if (err instanceof Error && err.message === "The requested resource wasn't found.") {
			throw error(404, { message: 'Код не найден' });
		} else throw error(500, { message: 'Сервер не доступен' });
	}
};
const createUser = async (locals: App.Locals, data: { email: string; name: string; password: string; passwordConfirm: string; referrer: string; newUser: boolean; }) => {
	try {
		await locals.pb.collection('users').create(data);
		await locals.pb.collection('users').authWithPassword(data.email, data.password);
		locals.pb.collection('users').requestVerification(data.email).catch();
		locals.user = locals.pb.authStore.model;
		const cookie = locals.pb.authStore.exportToCookie({ httpOnly: false });
		return new Response(JSON.stringify(cookie), { status: 200, headers: {} });
	} catch (err) {
		if (err instanceof Error && err.message === "Failed to create record.") {
			throw error(400, { message: 'Email уже зарегистрирован' });
		} else throw error(500, { message: 'Сервер не доступен' });
	}
};
const authenticateUser = async (locals: App.Locals, data: { email: string; name: string; password: string; passwordConfirm: string; referrer: string; newUser: boolean; }) => {
	try {
		await locals.pb.collection('users').authWithPassword(data.email, data.password);
		locals.user = locals.pb.authStore.model;
		const cookie = locals.pb.authStore.exportToCookie({httpOnly: false});
		return new Response(JSON.stringify(cookie), { status: 200, headers: {} });
	} catch (err) {
		if (err instanceof Error && err.message === "Failed to authenticate.") {
			throw error(400, { message: 'Неверные данные' });
		} else throw error(500, { message: 'Сервер не доступен' });
	}
};
export const POST: RequestHandler = async ({ locals, request }) => {
	if (locals.user == null) {
		const data = await request.json();
		if (data.newUser && data.referrer?.length > 0) await findReferrer(locals, data.referrer);
		if (data.newUser) return await createUser(locals, data);
		else return await authenticateUser(locals, data);
	} else throw error(403, 'Вы уже авторизованы');
};