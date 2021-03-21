import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppearanceComponent} from './appearance.component';
import {MenusAppearancePanelComponent} from './panels/menus-appearance-panel/menus-appearance-panel.component';
import {AddMenuItemPanelComponent} from './panels/menus-appearance-panel/menus/add-menu-item-panel/add-menu-item-panel.component';
import {AppearancePanelMetaComponent} from './appearance-panel-meta/appearance-panel-meta.component';
import {MenuItemsComponent} from './panels/menus-appearance-panel/menus/menu-items/menu-items.component';
import {AppearanceRoutingModule} from './appearance-routing.module';
import {CodeEditorModalComponent} from './panels/custom-code-appearance-panel/code-editor-modal/code-editor-modal.component';
import {ThemesAppearancePanelComponent} from './panels/themes-appearance-panel/themes-appearance-panel.component';
import {CrupdateCssThemeModalComponent} from './panels/themes-appearance-panel/crupdate-css-theme-modal/crupdate-css-theme-modal.component';
import {CssThemeColorsPanelComponent} from '@common/admin/appearance/panels/themes-appearance-panel/css-theme-colors-panel/css-theme-colors-panel.component';
import {GeneralAppearancePanelComponent} from '@common/admin/appearance/panels/general-appearance-panel/general-appearance-panel.component';
import {HighlightInPreviewDirective} from './highlight-in-preview.directive';
import {SeoAppearancePanelComponent} from '@common/admin/appearance/panels/seo-appearance-panel/seo-appearance-panel.component';
import {CustomCodeAppearancePanelComponent} from '@common/admin/appearance/panels/custom-code-appearance-panel/custom-code-appearance-panel.component';
import {AppearanceImageInputComponent} from '@common/admin/appearance/appearance-image-input/appearance-image-input.component';
import {IconSelectorModule} from '@common/shared/icon-selector/icon-selector.module';
import {TranslationsModule} from '@common/core/translations/translations.module';
import {ImageOrIconModule} from '@common/core/ui/image-or-icon/image-or-icon.module';
import {LoadingIndicatorModule} from '@common/core/ui/loading-indicator/loading-indicator.module';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {ColorPickerInputModule} from '@common/core/ui/color-picker/color-picker-input/color-picker-input.module';
import {PortalModule} from '@angular/cdk/portal';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {APPEARANCE_EDITOR_CONFIG, DEFAULT_APPEARANCE_EDITOR_CONFIG} from './appearance-editor-config.token';

@NgModule({
    imports: [
        AppearanceRoutingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IconSelectorModule,
        TranslationsModule,
        ImageOrIconModule,
        LoadingIndicatorModule,
        ColorPickerInputModule,

        // material
        MatMenuModule,
        MatProgressBarModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatExpansionModule,
        DragDropModule,
        MatSidenavModule,
        PortalModule,
        MatSlideToggleModule,
    ],
    exports: [
        AppearancePanelMetaComponent,
        HighlightInPreviewDirective,
        AppearanceImageInputComponent,
    ],
    declarations: [
        AppearanceComponent,
        AddMenuItemPanelComponent,
        AppearancePanelMetaComponent,
        MenuItemsComponent,
        CodeEditorModalComponent,
        CrupdateCssThemeModalComponent,
        CssThemeColorsPanelComponent,
        AppearanceImageInputComponent,
        MenusAppearancePanelComponent,
        ThemesAppearancePanelComponent,
        GeneralAppearancePanelComponent,
        SeoAppearancePanelComponent,
        CustomCodeAppearancePanelComponent,
        HighlightInPreviewDirective,
    ],
    providers: [
        {
            provide: APPEARANCE_EDITOR_CONFIG,
            useValue: DEFAULT_APPEARANCE_EDITOR_CONFIG,
            multi: true,
        }
    ]
})
export class BaseAppearanceModule {
}
