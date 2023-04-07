import type { PageServerLoad }  from './$types';
import { home } from "$lib/server/seo";
export const load: PageServerLoad = async () => home;