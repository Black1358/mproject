import type {PageServerLoad} from './$types';
import {cabinetMessages} from "$lib/server/seo";
import {redirect} from '@sveltejs/kit'
export const load: PageServerLoad = async ({ locals}) => {
	if (locals.user !== null) return {
		metaTitle: cabinetMessages.metaTitle,
		metaDesc: cabinetMessages.metaDesc,
	};
	else throw redirect(301, "/auth");
};