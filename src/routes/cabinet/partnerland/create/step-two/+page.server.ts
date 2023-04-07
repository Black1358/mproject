import type { PageServerLoad } from './$types';
import { vendorStepTwo } from "$lib/server/seo";
import { redirect } from "@sveltejs/kit";
import { getRedirectPath } from '$lib/server/become';
export const load: PageServerLoad = async ({ locals , url}) => {
	const { user, partner } = locals;
	const router = getRedirectPath(user, partner);
	if (router == url.pathname) return vendorStepTwo;
	throw redirect(303, router);
}