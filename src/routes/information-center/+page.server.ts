import type {PageServerLoad} from './$types';
export const load = (async () => {
	return {
		metaTitle: "Стать партнёром - Мастерская Подарков",
		metaDesc: "Решили к нам присоединиться? Пора уже! Добро пожаловать, мы всегда рады новым партнёрам и буквально через пару часов с вами свяжемся!",
	};
}) satisfies PageServerLoad;