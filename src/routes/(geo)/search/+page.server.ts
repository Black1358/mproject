import type { PageServerLoad}  from './$types';
import { search } from "$lib/server/seo";
export const load: PageServerLoad = async () => search;