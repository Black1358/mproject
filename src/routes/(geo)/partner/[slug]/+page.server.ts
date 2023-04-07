import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
export const load: PageServerLoad = async ({ params, locals }) => {
	try {
		const { slug } = params;
		const { pb } = locals;
		const vendor = await pb.collection('vendors').getFirstListItem(`slug = "${slug}"`);
		const products = await pb.collection('products').getList(1, 48, {filter: `vendor.id = "${vendor.id}"`, sort: '-created',});
		return {
			metaTitle: `${vendor.name} - Мастерская Подарков`,
			metaDesc: vendor.metaDesc || vendor.desc,
			vendor: JSON.stringify(vendor),
			products: JSON.stringify(products.items),
			totalPages: products.totalPages,
		};
	} catch (err) {
		if (err instanceof Error && err.message === "The requested resource wasn't found.") throw error(404);
		else throw error(500, { message: 'Сервер не доступен' });
	}
};