import {error, json} from '@sveltejs/kit';
import type { RequestHandler } from './$types';
export const POST = (async ({ locals, request  }) => {
    const data = await request.json();
    try {
        await locals.pb.collection('cartItems').delete(data.cartItem);
        const success = { code: 200 };
        return json(success);
    } catch (_){ throw error(500) }
}) satisfies RequestHandler;