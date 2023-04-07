import {fetchJson, fetchData, performFetch} from "$lib/internal/helpers";
export interface Requisites {
	type: "ip" | "ur" | any;
	contactSurname: string;
	contactName: string;
	contactPatronymic: string;
	contactPhone: string;
	inn: string;
	dadata?: string;
}
export const stepOne = (agree: boolean, gov: string): Promise<boolean> => performFetch([agree, gov], fetchData, "/api/partner/become/step-one", { gov });
export const stepTwo = (requisites: Requisites): Promise<boolean> => performFetch([
			requisites.contactSurname,
			requisites.contactName,
			requisites.contactPhone,
			requisites.inn,
			requisites.type === "ip" || requisites.type === "ur" ? requisites.dadata : true,
		], fetchData, "/api/partner/become/step-two", requisites );
export const stepThree = (paymentAccount: string, bank: string): Promise<boolean> => performFetch([paymentAccount, bank], fetchData, "/api/partner/become/step-three", { paymentAccount, bank });
export const stepConsole = (consoleId: string): Promise<boolean> => performFetch([consoleId], fetchData, "/api/partner/become/console", { consoleId });
export const suggestionsParty = async (query: string, type: string) => performFetch([query.length > 2], fetchJson, "/api/partner/become/suggestions-party", { query, type });
export const suggestionsBank = async (query: string) => performFetch([query.length > 2], fetchJson, "/api/partner/become/suggestions-bank", {query});
export const checkSamStatus = async (inn: string) => performFetch([inn], fetchJson, "https://statusnpd.nalog.ru/api/v1/tracker/taxpayer_status", { inn, requestDate: new Date().toISOString().substring(0, 10) } );