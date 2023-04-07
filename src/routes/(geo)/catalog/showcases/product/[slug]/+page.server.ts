import type {PageServerLoad} from './$types';
import {error} from "@sveltejs/kit";
export const load: PageServerLoad = async ({ params, locals}) => {
	try {
		const [product, recommends] = await Promise.all([
			locals.pb.collection('products').getFirstListItem(`slug = "${params.slug}"`, {expand: 'vendor'}),
			locals.pb.collection("products").getList(1, 12, { filter: `slug != "${params.slug}"`, sort: "created" })
		]);
		return {
			metaTitle: product.name + " - Мастерская Подарков",
			metaDesc: product.metaDesc || product.desc,
			product: JSON.stringify(product),
			recommends: JSON.stringify(recommends.items),
		};
	} catch (err) {
		if (err instanceof Error && err.message === "The requested resource wasn't found.") throw error(404);
		else throw error(500, {message: "Сервер не доступен"});
	}
};