import type { PageServerLoad } from './$types';
import { vendorStepOne } from "$lib/server/seo";
import { redirect } from "@sveltejs/kit";
import { getRedirectPath } from '$lib/server/become';
export const load: PageServerLoad = async ({ locals , url}) => {
	const { user, partner } = locals;
	const router = getRedirectPath(user, partner);
	if (router == url.pathname) return vendorStepOne;
	throw redirect(303, router);
};