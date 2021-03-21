import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DriveDomCacheService {
    public scrollCont: HTMLElement;
    public filesCont: HTMLElement;
    public filesContRect: ClientRect;
    public scrollContRect: ClientRect;
    public dragPreview: HTMLElement;
}
