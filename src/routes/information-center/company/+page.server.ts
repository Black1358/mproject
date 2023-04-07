import type {PageServerLoad} from './$types';
export const load = (async () => {
	return {
		metaTitle: "Мастерская подарков - уникальные товары со всей России",
		metaDesc: "В нашем интернет-магазине подарков и сувениров вы можете найти необычные подарки для любого повода ручной изготовления. Ждём только вас💛"
	};
}) satisfies PageServerLoad;