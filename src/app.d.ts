import type {PocketBase, Admin, Record} from "pocketbase";
declare global {
	namespace App {
		interface Error {
			message: string;
		}
		interface Locals {
			pb: PocketBase,
			user:  Record | Admin | null,
			partner: Record | Admin | null,
			vendor: Record | Admin | null,
		}
	}
}
export {};