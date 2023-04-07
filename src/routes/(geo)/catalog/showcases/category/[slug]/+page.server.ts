import type { PageServerLoad } from './$types';
import { error } from "@sveltejs/kit";
export const load = (async ({locals, params}) => {
	try {
		const category = await locals.pb.collection('categories').getFirstListItem(`slug = "${params.slug}"`);
		const childs = async () => {return JSON.stringify(await locals.pb.collection('categories').getFullList({sort: '-created', filter: `parent.id = "${category.id}"`}))}
		const products = async () => {return JSON.stringify(await locals.pb.collection('products').getFullList({sort: '-created', filter: `categories ?= "${category.id}"`}))}
		return {
			metaTitle: category.metaTitle,
			metaDesc: category.metaDesc,
			category: JSON.stringify(category),
			childs: childs(),
			products: products()
		};
	} catch (_) {throw error(404)}
}) satisfies PageServerLoad;