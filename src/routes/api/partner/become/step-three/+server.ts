import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { isAuthUser } from '$lib/server/user';
export const POST: RequestHandler = async ({locals, request}) => {
	isAuthUser(locals.user, true);
	if (locals.partner && locals.partner?.status == "two") {
		try {
			const data = await request.json();
			await locals.pb.collection('partners').update(locals.partner.id, {paymentAccount: data.paymentAccount, bank: data.bank, status: "three"});
			return new Response(null, { status: 200, headers: {} });
		} catch (_) { throw error(500) }
	} else throw error(403, 'Ошибка доступа');
};