import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit'
export const POST: RequestHandler = async ({ locals, request }) => {
	const data = await request.formData();
	if (data.get("slug") !== locals.vendor?.slug) {
		let notFound;
		try {
			await locals.pb.collection('vendors').getFirstListItem(`slug="${data.get("slug")}"`);
			notFound = false;
		} catch (_) {
			notFound = true;
		}
		if (!notFound) throw error(403, 'Ссылка уже занята');
	}
	try {
		await locals.pb.collection('vendors').update(locals.vendor?.id, data);
		return new Response(null, { status: 200, headers: {} });
	} catch (_) {throw error(500, { message: 'Произошла ошибка' })}
};