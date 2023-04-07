import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { isAuthUser} from '$lib/server/user';
import { checkProps, checkTel } from '$lib/server/dadata';
export const POST: RequestHandler = async ({locals, request}) => {
	isAuthUser(locals.user, true);
	if (locals.partner && locals.partner?.status == "one") {
		try {
			const data = await request.json();
			const dadataPhone = await checkTel(data.contactPhone);
			const dadataProps = await checkProps(data.contactSurname + " " + data.contactName+ " " + data.contactPatronymic);
			await locals.pb.collection('partners').update(locals.partner.id, {
				contactName: data.contactName,
				contactPatronymic: data.contactPatronymic,
				contactPhone: data.contactPhone,
				contactSurname: data.contactSurname,
				dadata: data.dadata,
				dadataProps: dadataProps,
				dadataPhone: dadataPhone,
				inn: data.inn,
				status: 'two'
			});
			return new Response(null, { status: 200, headers: {} });
		} catch (_) { throw error(500, 'Не удалось обновить данные'); }
	} else throw error(403, 'Ошибка доступа');
};