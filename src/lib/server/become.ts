import type { Admin, Record } from "pocketbase";

type StatusToPath = { [key in Record["status"]]: string } & { default: string };

const statusToPath: StatusToPath = {
	auth: "/auth?type=partner",
	become: "/become-partner/registration/step-one",
	one: "/become-partner/registration/step-two",
	two: "/become-partner/registration/step-three",
	console: "/cabinet/partnerland/create/step-one",
	"vendor-one": "/cabinet/partnerland/create/step-two",
	"vendor-two": "/cabinet/partnerland",
	default: "/cabinet",
};

export const getRedirectPath = ((user: Record | Admin | null, partner: Record | Admin | null): string => user === null ? statusToPath.auth : partner === null ? statusToPath.become : statusToPath[partner.status] || statusToPath.default);