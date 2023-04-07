import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { minify } from 'html-minifier';
import PocketBase from 'pocketbase';

import { minification_options, pocket } from '$lib/server/config';
import { checkCookie, handleRedirect } from '$lib/server/redirect';

export const handle: Handle = async ({ event, resolve }) => {
	//Редиректы
	const redirectURL = handleRedirect(event.url.pathname);
	if (redirectURL) throw redirect(301, redirectURL);

	//Юзер
	event.locals.pb = new PocketBase(pocket.url);
	const authCookie = event.request.headers.get('cookie') || '';
	const hasPbAuth = checkCookie(authCookie, 'pb_auth');
	if (hasPbAuth) {
		event.locals.pb.authStore.loadFromCookie(authCookie);
		try {
			event.locals.pb.authStore.isValid && await event.locals.pb.collection('users').authRefresh();
			event.locals.user = event.locals.pb.authStore.model;
		} catch (_) {
			event.locals.pb.authStore.clear();
			event.locals.user = null;
			if (event.url.pathname.startsWith('/cabinet')) throw redirect(303, '/auth');
		}
		if (event.locals.user?.partner) {
			event.locals.partner = await event.locals.pb.collection('partners').getOne(event.locals.user.partner, {expand: 'vendor'});
			event.locals.vendor = event.locals.partner?.expand.vendor ? event.locals.partner?.expand.vendor : null;
		}
		else { event.locals.partner = null; event.locals.vendor = null; }
	} else { event.locals.user = null; event.locals.partner = null; event.locals.vendor = null; }

	const response = await resolve(event);
	if (hasPbAuth) {
		response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({ httpOnly: false }));
		if (event.url.pathname.startsWith('/auth')) throw redirect(303, '/cabinet');
	} else if (event.url.pathname.startsWith('/cabinet')) throw redirect(303, '/auth');

	if (response.headers.get('Content-Type') === 'text/html') return new Response(minify(await response.text(), minification_options), { status: response.status, headers: response.headers });
	return response;
};