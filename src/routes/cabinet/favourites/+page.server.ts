import type {PageServerLoad} from './$types';
import {cabinetFavourites} from "$lib/server/seo";
import {redirect} from '@sveltejs/kit'
export const load: PageServerLoad = async ({ locals}) => {
	if (locals.user !== null) return {
		metaTitle: cabinetFavourites.metaTitle,
		metaDesc: cabinetFavourites.metaDesc,
	};
	else throw redirect(301, "/auth")
};