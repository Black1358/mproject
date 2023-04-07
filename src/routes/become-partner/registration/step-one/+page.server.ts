import type { PageServerLoad } from './$types';
import { becomeStepOne } from "$lib/server/seo";
import { getRedirectPath } from '$lib/server/become';
import { redirect } from "@sveltejs/kit";
export const load: PageServerLoad = async ({ locals , url}) => {
	const { user, partner } = locals;
	const router = getRedirectPath(user, partner);
	if (router == url.pathname) return becomeStepOne;
	throw redirect(303, router);
};