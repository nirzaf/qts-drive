import {Injectable} from '@angular/core';
import {Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {map} from 'rxjs/operators';
import {ValueLists} from '../../core/services/value-lists.service';

@Injectable({
    providedIn: 'root'
})
export class CurrenciesListResolver implements Resolve<any> {
    constructor(private valueLists: ValueLists) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        return this.valueLists.get(['currencies']).pipe(map(response => response.currencies)).toPromise();
    }
}

