import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import SwaggerUI from 'swagger-ui';
import { Settings } from '../core/config/settings.service';
import { LazyLoaderService } from '../core/utils/lazy-loader.service';

@Component({
    selector: 'api-docs',
    templateUrl: './api-docs.component.html',
    styleUrls: ['./api-docs.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiDocsComponent implements OnInit {
    @ViewChild('docsContainer') apiDocsEl: ElementRef<HTMLDivElement>;

    constructor(
        private settings: Settings,
        private lazyLoader: LazyLoaderService
    ) {}

    ngOnInit(): void {
        this.lazyLoader.loadAsset('css/swagger-ui.css', {type: 'css'})
            .then(() => {
                SwaggerUI({
                    domNode: this.apiDocsEl.nativeElement,
                    url: this.settings.getBaseUrl(true) + 'swagger.yaml',
                    plugins: [
                        {
                            statePlugins: {
                                spec: {
                                    wrapActions: {
                                        updateSpec: (oriAction) => {
                                            return (spec) => {
                                                // Replace site name
                                                spec = spec.replaceAll('BeDrive', this.settings.get('branding.site_name'));
                                                // Replace site url
                                                spec = spec.replaceAll('https://bedrive.vebto.com', this.settings.getBaseUrl(true));
                                                return oriAction(spec);
                                            };
                                        },
                                        // Add current server url to docs
                                        updateJsonSpec: (oriAction) => {
                                            return (spec) => {
                                                spec.servers = [{url: this.settings.getBaseUrl(true) + 'api/v1'}];
                                                return oriAction(spec);
                                            };
                                        }
                                    }
                                }
                            }
                        }
                    ]
                });
            });
    }
}
