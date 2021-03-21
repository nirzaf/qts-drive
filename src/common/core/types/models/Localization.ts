export class Localization {
	id: number;
	name: string;
	language: string;
	created_at?: string;
	updated_at?: string;

	constructor(params: Object = {}) {
        for (const name in params) {
            this[name] = params[name];
        }
    }
}
