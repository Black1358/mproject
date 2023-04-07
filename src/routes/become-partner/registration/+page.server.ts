import type { PageServerLoad } from './$types';
import { getRedirectPath } from '$lib/server/become';
import { redirect } from "@sveltejs/kit";
export const load: PageServerLoad = async ({ locals }) => {
	const { user, partner } = locals;
	const router = getRedirectPath(user, partner);
	throw redirect(303, router);
};