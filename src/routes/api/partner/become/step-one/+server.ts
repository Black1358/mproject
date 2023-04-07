import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { isAuthUser } from '$lib/server/user';
export const POST: RequestHandler = async ({locals, request}) => {
	isAuthUser(locals.user, true);
	if (locals.user?.partner === "") {
		try {
			const data = await request.json();
			const partner = await locals.pb.collection('partners').create({owner: locals.user.id, type: data.gov, status: "one"});
			await locals.pb.collection('users').update(locals.user.id, { partner: partner.id })
			return new Response(null, {status: 200, headers: {}});
		} catch (_) { throw error(500, 'Не удалось создать партнера'); }
	} else throw error(403, 'Пользователь уже партнёр!');
};