import type { PageServerLoad } from './$types';
import { auth } from "$lib/server/seo";
export const load: PageServerLoad = async () => auth;