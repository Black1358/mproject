import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ locals}) => {
	const categories = await locals.pb.collection('categories').getFullList({sort: '-created'});
	const specifications = await locals.pb.collection('specifications').getFullList({sort: '-created'});
	const services = await locals.pb.collection('services').getFullList({filter: `vendor.id = "${locals.vendor?.id}"`,sort: '-created'});

	return {
		categories: JSON.stringify(categories),
		specifications: JSON.stringify(specifications),
		services: JSON.stringify(services),
	}
};