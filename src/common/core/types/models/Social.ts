import {User} from "./User";

export class Social {
	id: number;
	user_id: number;
	service: string;
	token: string;
	created_at: string = '0000-00-00 00:00:00';
	updated_at: string = '0000-00-00 00:00:00';
	user?: User;

	constructor(params: Object = {}) {
        for (let name in params) {
            this[name] = params[name];
        }
    }
}