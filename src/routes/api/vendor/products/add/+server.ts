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

			const product = await locals.pb.collection('products').create(data);
			await locals.pb.collection('products').update( product.id, {categories} );
			return new Response(null, {status: 200, headers: {}});
		} catch (_) { throw error(500, 'Не удалось создать'); }
	} else throw error(403, 'Ошибка доступа');
};