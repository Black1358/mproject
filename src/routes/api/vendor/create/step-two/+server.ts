import type {RequestHandler} from './$types';
import {error} from '@sveltejs/kit';
import {isAuthUser} from '$lib/server/user';
export const POST: RequestHandler = async ({locals, request}) => {
	isAuthUser(locals.user, true);
	if (locals.partner && locals.partner?.status == "vendor-one") {
		try {
			const data = await request.json();
			await locals.pb.collection('warehouses').create({vendor: locals.partner?.vendor, ...data });
			await locals.pb.collection('partners').update(locals.partner?.id, { status: "vendor-two" })
			return new Response(null, {status: 200, headers: {}});
		} catch (_) { throw error(500, 'Не удалось создать вендора'); }
	} else throw error(403, 'Ошибка доступа');
};