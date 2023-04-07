import type { PageServerLoad } from './$types';
import { cabinetSettings } from "$lib/server/seo";
import { redirect } from '@sveltejs/kit'
export const load: PageServerLoad = async ({ locals}) => {
	if (locals.user !== null) return cabinetSettings;
	else throw redirect(303, "/auth")
};