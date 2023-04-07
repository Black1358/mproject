import type { RequestHandler } from './$types';
export const GET: RequestHandler = async ({ locals, url }) => {
	const { searchParams } = url;
	const pageParam = searchParams.get("page");
	const vendor = searchParams.get("vendor");
	const page = pageParam !== null ? parseInt(pageParam, 10) : 1;
	const products = await locals.pb.collection('products').getList(page, 48, {filter: `vendor.id = "${vendor}"`,sort: '-created'});
	return new Response(JSON.stringify(products.items), { status: 200 });
};