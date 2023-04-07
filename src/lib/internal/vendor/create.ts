import {fetchData, performFetch} from '$lib/internal/helpers';
export const vendorStepTwo = (name: string, latitude: string, longitude: string, address: string, porch: string, sfloor: string, sflat: string, comment: string, cdekID: string, cdekCityCode: string): Promise<boolean> =>
	performFetch([name, latitude, longitude, address, cdekID, cdekCityCode], fetchData, "/api/vendor/create/step-two",
		{name, latitude, longitude, address, porch, sfloor, sflat, comment, cdekID, cdekCityCode});