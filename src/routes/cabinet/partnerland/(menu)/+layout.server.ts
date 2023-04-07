import type { LayoutServerLoad } from './$types';
import { redirect } from "@sveltejs/kit";
import { getRedirectPath } from '$lib/server/become';
export const load: LayoutServerLoad = async ({ locals }) => {
	const { user, partner } = locals;
	const router = getRedirectPath(user, partner);
	if (router !== "/cabinet/partnerland") throw redirect(303, router);
}