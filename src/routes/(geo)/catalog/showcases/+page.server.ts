import type {PageServerLoad} from './$types';
export const load = (async () => {
	return {
		metaTitle: "Товары и услуги - Мастерская Подарков",
		metaDesc: "Товары и услуги - Мастерская Подарков",
	};
}) satisfies PageServerLoad;