import type {RequestHandler} from './$types';
import {isAuthUser} from '$lib/server/user';
import {suggestionsBank} from '$lib/server/dadata';
export const POST: RequestHandler = async ({locals, request}) => {
	isAuthUser(locals.user, true);
	const data = await request.json();
	return new Response(JSON.stringify(await suggestionsBank(data.query)), { status: 200, headers: {} });
};