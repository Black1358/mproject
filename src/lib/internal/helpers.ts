import copy from 'clipboard-copy';
import { copyToast, err } from '$lib/internal/toasts'

export const fetchWithMethod = async (url: string, method: string, body: any): Promise<Response | null> => {
	try {
		return await fetch(url, {method: method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)});
	} catch (_) {return null}
};
export const fetchJson = async (url: string, body: any): Promise<string | null> => {
	const response = await fetchWithMethod(url, "POST", body);
	return response ? await response.json() : null;
};
export const fetchData = async (url: string, body: any): Promise<boolean> => {
	const response = await fetchWithMethod(url, "POST", body);
	return response ? response.status === 200 : false;
};
export const performFetch = async ( requiredFields: any[], fetchFn: (url: string, data: any) => Promise<any>, url: string, data: any): Promise<any> => (requiredFields.every((field) => !!field)) ? await fetchFn(url, data) : false;

interface CyrillicToLatinMap {[key: string]: string;}

const cyrillicToLatin: CyrillicToLatinMap = {
	'А': 'A', 'а': 'a',
	'Б': 'B', 'б': 'b',
	'В': 'V', 'в': 'v',
	'Г': 'G', 'г': 'g',
	'Д': 'D', 'д': 'd',
	'Е': 'E', 'е': 'e',
	'Ё': 'Yo', 'ё': 'yo',
	'Ж': 'Zh', 'ж': 'zh',
	'З': 'Z', 'з': 'z',
	'И': 'I', 'и': 'i',
	'Й': 'Y', 'й': 'y',
	'К': 'K', 'к': 'k',
	'Л': 'L', 'л': 'l',
	'М': 'M', 'м': 'm',
	'Н': 'N', 'н': 'n',
	'О': 'O', 'о': 'o',
	'П': 'P', 'п': 'p',
	'Р': 'R', 'р': 'r',
	'С': 'S', 'с': 's',
	'Т': 'T', 'т': 't',
	'У': 'U', 'у': 'u',
	'Ф': 'F', 'ф': 'f',
	'Х': 'H', 'х': 'h',
	'Ц': 'Ts', 'ц': 'ts',
	'Ч': 'Ch', 'ч': 'ch',
	'Ш': 'Sh', 'ш': 'sh',
	'Щ': 'Sch', 'щ': 'sch',
	'Ъ': '', 'ъ': '',
	'Ы': 'Y', 'ы': 'y',
	'Ь': '', 'ь': '',
	'Э': 'E', 'э': 'e',
	'Ю': 'Yu', 'ю': 'yu',
	'Я': 'Ya', 'я': 'ya',
};

export const transliterate = (input: string): string => {
	let output = '';
	for (let i = 0; i < input.length; i++) {
		const currentChar = input[i];
		const latinChar = cyrillicToLatin[currentChar] || currentChar;
		const lowerCaseLatinChar = latinChar.toLowerCase();
		const hyphenatedChar = lowerCaseLatinChar === ' ' ? '-' : lowerCaseLatinChar;

		// Оставьте только дефисы, пробелы, буквы и цифры
		if (/[a-z0-9\-]/i.test(hyphenatedChar) || hyphenatedChar === ' ') {
			output += hyphenatedChar;
		}
	}
	return output;
};


export const copyToClipboard = (copyStr: string) => {
	copy(copyStr).then(() => {copyToast();}).catch(() => {err()});
}