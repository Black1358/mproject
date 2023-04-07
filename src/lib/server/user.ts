import type {Record, Admin} from "pocketbase";
import {error} from '@sveltejs/kit';
export const isAuthUser = (user: Record | Admin | null, err: boolean): boolean => {
	if (err) {
		if (user === null) throw error(401, 'Ошибка аутентификации');
		else return true;
	} else return user !== null;
};