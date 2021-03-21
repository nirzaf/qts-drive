import { snakeCase } from './snake-case';

export function kebabCase(text: string) {
    return snakeCase(text).replace('_', '-');
}
