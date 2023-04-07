const tokenDaData = "27b75917ddce7625328bb4708de83baad06ab88a";
const secretDaData = "21bcd097958890f408f1a969ccf411a0ceca718c";

const headersDaData = {
	"Content-Type": "application/json",
	Accept: "application/json",
	Authorization: "Token " + tokenDaData,
};
const headersDaDataSecret = {...headersDaData, "X-Secret": secretDaData};
const suggestionsURL = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest";
const cleanerBaseURL = "https://cleaner.dadata.ru/api/v1/clean";

const fetchDataFromDaData = async (url: string, query: string) => {
	try {
		const response = await fetch(url, { method: "POST", headers: headersDaData, body: JSON.stringify({ query }) });
		const data = await response.json();
		return data.suggestions || [];
	} catch (_) {
		return [];
	}
};
const fetchDataFromDaDataType = async (url: string, query: string, type: string) => {
	try {
		const response = await fetch(url, { method: "POST", headers: headersDaData, body: JSON.stringify({ query, type }) });
		const data = await response.json();
		return data.suggestions || [];
	} catch (_) {
		return [];
	}
};
const fetchSecretDataFromDaData = async (url: string, data: string) => {
	try {
		const response = await fetch(url, {method: "POST", headers: headersDaDataSecret, body: JSON.stringify([data]), });
		return await response.json();
	} catch (err) {
		return err;
	}
};
export const suggestionsParty = async (query: string, type: string) => query.length > 2 ? await fetchDataFromDaDataType(`${suggestionsURL}/party`, query, type) : [];
export const suggestionsBank = async (query: string) => query.length > 2 ? await fetchDataFromDaData(`${suggestionsURL}/bank`, query) : [];
export const checkTel = async (tel: string) => await fetchSecretDataFromDaData(`${cleanerBaseURL}/phone`, tel);
export const checkProps = async (props: string) => await fetchSecretDataFromDaData(`${cleanerBaseURL}/name`, props);