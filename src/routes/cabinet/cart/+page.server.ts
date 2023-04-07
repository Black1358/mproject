import type { PageServerLoad } from './$types';
import { cabinetCart } from "$lib/server/seo";
import { error, redirect } from '@sveltejs/kit'
export const load: PageServerLoad = async ({ locals}) => {
	if (locals.user !== null) {
		try {
			const cart = await locals.pb.collection('cartItems').getFullList(`cart = "${locals.user?.cart}"`, {expand: 'product'});
			return {
				metaTitle: cabinetCart.metaTitle,
				metaDesc: cabinetCart.metaDesc,
				cart: JSON.stringify(cart)
			};
		} catch (_) {throw error(503)}
	} else throw redirect(301, "/auth");
};