import type {LayoutServerLoad} from './$types';
import { redirect } from '@sveltejs/kit'
export const load = (async ({locals}) => {
    if (locals.user !== null) return {
        chalistid: "chatlist" + locals.user?.id,
    };
    else throw redirect(301, "/auth")
}) satisfies LayoutServerLoad;