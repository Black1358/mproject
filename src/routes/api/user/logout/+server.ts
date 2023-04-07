import type { RequestHandler } from './$types';
export const POST: RequestHandler = async ({ locals }) => {
	locals.pb.authStore.clear();
	locals.user = null;
	return new Response(null, {status: 200,headers: {'Set-Cookie': 'pb_auth=; Max-Age=0'}});
};