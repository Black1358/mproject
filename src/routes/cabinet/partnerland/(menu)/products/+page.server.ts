import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ locals}) => {
	const categories = await locals.pb.collection('categories').getFullList({sort: '-created'});
	const specifications = await locals.pb.collection('specifications').getFullList({sort: '-created'});
	const products = await locals.pb.collection('products').getFullList({filter: `vendor.id = "${locals.vendor?.id}"`,sort: '-created'});

	return {
		categories: JSON.stringify(categories),
		specifications: JSON.stringify(specifications),
		products: JSON.stringify(products),
	}
};