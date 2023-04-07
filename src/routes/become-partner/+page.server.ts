import type { PageServerLoad }  from './$types';
import { become } from "$lib/server/seo";
export const load: PageServerLoad = async () => become;