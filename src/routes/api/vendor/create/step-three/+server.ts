import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit'
export const POST: RequestHandler = async ({ locals, request }) => {
	const data = await request.formData();
	try {
		await locals.pb.collection('vendors').update(locals.vendor?.id, data);
		return new Response(null, { status: 200, headers: {} });
	} catch (_) {throw error(500, { message: 'Произошла ошибка' })}
};