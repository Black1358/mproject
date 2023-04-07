import type { PageServerLoad } from './$types';
import { becomeStepThree } from "$lib/server/seo";
import { getRedirectPath } from '$lib/server/become';
import { redirect } from "@sveltejs/kit";
export const load: PageServerLoad = async ({ locals , url}) => {
	const { user, partner } = locals;
	const router = getRedirectPath(user, partner);
	if (router == url.pathname) return becomeStepThree;
	throw redirect(303, router);
};