import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { isAuthUser } from '$lib/server/user';
export const POST: RequestHandler = async ({locals, request}) => {
	isAuthUser(locals.user, true);
	if (locals.partner && locals.partner?.status == "console") {
		let notFound;
		const data = await request.json();
		try {
			await locals.pb.collection('vendors').getFirstListItem(`slug="${data.slug}"`);
			notFound = false;
		} catch (_) {
			notFound = true;
		}
		if (!notFound) throw error(403, 'Ссылка уже занята');
		else {
			try {
				const vendor = await locals.pb.collection('vendors').create({partner: locals.partner?.id, type: data.type, name: data.name, slug: data.slug });
				await locals.pb.collection('partners').update(locals.partner?.id, {vendor: vendor.id, status: "vendor-one" })
				return new Response(null, {status: 200, headers: {}});
			} catch (_) { throw error(500, 'Не удалось создать вендора'); }
		}
	} else throw error(403, 'Ошибка доступа');
};