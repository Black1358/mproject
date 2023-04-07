import toast from 'svelte-french-toast';
import type { ToastPosition } from 'svelte-french-toast/core/types';

export const toastOptions: Partial<{position: ToastPosition; style: string;}> = {
	position: "bottom-center" as ToastPosition,
	style: 'border-radius: 0.5rem; text-align:center; background: #2a4060; color: #fff',
};

export const err = () => {toast.error('Произошла ошибка 😢', toastOptions)};

export const welcome = () => {toast.success("Приветствуем!", toastOptions)};
export const good = () => {toast.success('Сохранено! 👍🏻', toastOptions)};
export const save = () => {toast.success('Сохранено! 👍🏻', toastOptions)};
export const copyToast = () => {toast.success('Скопировано! 👍🏻', toastOptions)};