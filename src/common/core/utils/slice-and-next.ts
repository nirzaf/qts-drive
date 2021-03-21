import {BehaviorSubject} from 'rxjs';

interface ModelWithId {
    id: number|string;
}

export function sliceAndNext(obs: BehaviorSubject<ModelWithId[]>, model: ModelWithId) {
    const i = obs.value.findIndex(v => v.id === model.id);
    if (i > -1) {
        const value = [...obs.value];
        value.slice(i, 1);
        obs.next(value);
    }
}
