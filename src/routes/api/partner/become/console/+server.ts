import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { isAuthUser } from '$lib/server/user';
export const POST: RequestHandler = async ({locals}) => {
	isAuthUser(locals.user, true);
	if (locals.partner && locals.partner?.status == "three") {
		try {
			await locals.pb.collection('partners').update(locals.partner.id, {status: "console"});
			return new Response(null, { status: 200, headers: {} });
		} catch (_) { throw error(500) }
	} else throw error(403, 'Ошибка доступа');
};