import {User} from "./User";

export class SocialProfile {
	id: number;
	user_id: number;
	username?: string;
	service_name: string;
	user_service_id: string;
	created_at?: string;
	updated_at?: string;
	user?: User;

	constructor(params: Object = {}) {
        for (let name in params) {
            this[name] = params[name];
        }
    }
}