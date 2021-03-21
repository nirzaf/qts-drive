import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {snakeCase} from '@common/core/utils/snake-case';

@Component({
    selector: 'appearance-panel-meta',
    templateUrl: './appearance-panel-meta.component.html',
    styleUrls: ['./appearance-panel-meta.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppearancePanelMetaComponent {
    @Input() path: string[] = [];
    @Output() back = new EventEmitter();

    public viewName(name: string) {
        return snakeCase(name).replace(/_/g , ' ');
    }
}
