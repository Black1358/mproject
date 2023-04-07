import toast from 'svelte-french-toast';
import { err, toastOptions } from '$lib/internal/toasts';
import { goto, invalidateAll } from '$app/navigation';
const deleteCookie = () => {
	const cookieValue = document.cookie.split('; ').find(row => row.startsWith('pb_auth='));
	if (cookieValue) document.cookie = 'pb_auth=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};
export const logout = async () => {
	try {
		const response = await fetch('/api/user/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: null });
		if (response.status === 200) {
			deleteCookie();
			await invalidateAll();
			await goto('/auth');
			toast.success('Возвращайтесь! 💖', toastOptions);
		} else err();
	} catch (_) {err()}
};