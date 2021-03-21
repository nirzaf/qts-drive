import { ConnectedPosition } from '@angular/cdk/overlay';

export const LEFT_POSITION: ConnectedPosition[] = [
    {originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: 5},
    {originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 5},
];
