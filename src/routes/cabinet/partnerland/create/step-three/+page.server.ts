import type { PageServerLoad } from './$types';
import { vendorStepThree } from "$lib/server/seo";
import { redirect } from "@sveltejs/kit";
import { getRedirectPath } from '$lib/server/become';
export const load: PageServerLoad = async ({ locals }) => {
	const { user, partner } = locals;
	const router = getRedirectPath(user, partner);
	if (router == "/cabinet/partnerland") return vendorStepThree;
	throw redirect(303, router);
}