import type { LayoutServerLoad } from './$types';
export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		animation: 325,
		user: JSON.stringify(locals.user),
		partner: JSON.stringify(locals.partner),
		vendor: JSON.stringify(locals.vendor),
	};
};