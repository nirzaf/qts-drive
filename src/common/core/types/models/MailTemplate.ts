export class MailTemplate {
	id: number;
	file_name: string;
	display_name: string;
	subject?: string;
	action?: string;
	markdown: boolean;
	created_at?: string;
	updated_at?: string;

	constructor(params: Object = {}) {
        for (let name in params) {
            this[name] = params[name];
        }
    }
}