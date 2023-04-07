import type { PageServerLoad } from './$types';
import { cabinet } from "$lib/server/seo";
export const load: PageServerLoad = async ({ locals}) => {
	const { pb, user } = locals;
	const wallet = await pb.collection('wallets').getOne(user?.wallet, {});
	return {...cabinet, wallet: JSON.stringify(wallet)};
};