export type RedirectMap = {
	[key: string]: string;
};
const redirectMap: RedirectMap = {
	"/stat-partnyorom": "/become-partner",
	// добавьте другие пути для перенаправления здесь
};
export const handleRedirect = (url: string): string | undefined => {
	for (const [pathToCheck, redirectPath] of Object.entries(redirectMap)) if (url.startsWith(pathToCheck)) return redirectPath;
	return undefined;
}
export const checkCookie = (cookie: string, name: string): boolean => cookie.includes(name);