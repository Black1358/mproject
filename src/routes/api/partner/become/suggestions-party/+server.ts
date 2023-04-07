import type {RequestHandler} from './$types';
import {isAuthUser} from '$lib/server/user';
import {suggestionsParty} from '$lib/server/dadata';
export const POST: RequestHandler = async ({locals, request}) => {
	isAuthUser(locals.user, true);
	const data = await request.json();
	return new Response(JSON.stringify(await suggestionsParty(data.query, data.type)), { status: 200, headers: {} });
};