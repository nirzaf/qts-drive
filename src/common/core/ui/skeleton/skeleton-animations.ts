import {animate, style, transition, trigger} from '@angular/animations';

export const SKELETON_ANIMATIONS = [
    trigger('fadeIn', [
        transition(':enter', [
            style({opacity: 0}),
            animate('325ms ease-in', style({
                opacity: 1,
            }))
        ])
    ]),
    trigger('fadeOut', [
        transition(':leave', [
            style({opacity: 1, position: 'absolute', left: '0', right: '0'}),
            animate('325ms ease-out', style({
                opacity: 0
            }))
        ])
    ])
];
