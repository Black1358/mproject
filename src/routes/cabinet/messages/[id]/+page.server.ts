import type {PageServerLoad} from './$types';
import {error} from "@sveltejs/kit";
export const load = (async ({locals, params}) => {
	try {
		return {chatId: params.id};
	} catch (_) {throw error(404)}
}) satisfies PageServerLoad;