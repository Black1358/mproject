import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { isAuthUser } from '$lib/server/user';
export const POST: RequestHandler = async ({locals, request}) => {
	isAuthUser(locals.user, true);
	if (locals.vendor) {
		try {
			const data = await request.formData();
			const categories = data.get("categories");

			data.append('vendor', locals.vendor?.id);
			data.delete("categories");

			await locals.pb.collection('products').update( data.get("id"), data );
			await locals.pb.collection('products').update( data.get("id"), {categories} );
			return new Response(null, {status: 200, headers: {}});
		} catch (_) { throw error(500, 'Не удалось обновить'); }
	} else throw error(403, 'Ошибка доступа');
};