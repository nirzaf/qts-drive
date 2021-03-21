import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy} from '@angular/router';
import {objectsAreEqual} from '@common/core/utils/objects-are-equal';

@Injectable({
    providedIn: 'root'
})
export class CustomRouteReuseStrategy extends RouteReuseStrategy {
    shouldDetach(route: ActivatedRouteSnapshot): boolean { return false; }
    store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {}
    shouldAttach(route: ActivatedRouteSnapshot): boolean { return false; }
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle|null { return null; }


    shouldReuseRoute(future: ActivatedRouteSnapshot, current: ActivatedRouteSnapshot): boolean {
        // first use the global Reuse Strategy evaluation function,
        // which will return true, when we are navigating from the same component to itself
        let shouldReuse = future.routeConfig === current.routeConfig;

        // reuse if route params did not change, this will allow for
        // tabs on artist/user profile pages to work without re-rendering
        if (shouldReuse && current.data.noReuse && !objectsAreEqual(future.params, current.params)) {
            shouldReuse = false;
        }

        return shouldReuse;
    }
}
