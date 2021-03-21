import {NgModule} from '@angular/core';
import {CrupdateRoleModalComponent} from './roles/crupdate-role-modal/crupdate-role-modal.component';
import {UserIndexComponent} from './users/user-index.component';
import {AdminComponent} from './admin.component';
import {CrupdateUserModalComponent} from './users/crupdate-user-modal/crupdate-user-modal.component';
import {RoleIndexComponent} from './roles/role-index.component';
import {SelectRolesModalComponent} from './users/select-roles-modal/select-roles-modal.component';
import {AdsPageComponent} from './ads-page/ads-page.component';
import {SettingsModule} from './settings/settings.module';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TextEditorModule} from '../text-editor/text-editor.module';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatNativeDateModule, MatPseudoCheckboxModule, MatRippleModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {SelectPermissionsModalComponent} from './permissions/select-permissions-modal/select-permissions-modal.component';
import {PermissionManagerComponent} from './permissions/permission-manager/permission-manager.component';
import {CrupdatePlanModalComponent} from './billing/plans/crupdate-plan-modal/crupdate-plan-modal.component';
import {CrupdateSubscriptionModalComponent} from './billing/subscriptions/crupdate-subscription-modal/crupdate-subscription-modal.component';
import {SubscriptionIndexComponent} from './billing/subscriptions/subscription-index/subscription-index.component';
import {PlanIndexComponent} from './billing/plans/plan-index/plan-index.component';
import {SpaceInputModule} from '../core/ui/space-input/space-input.module';
import {COMMON_ADMIN_CONFIG} from './common-admin-config';
import {Settings} from '../core/config/settings.service';
import {FullPlanNameModule} from '../shared/billing/full-plan-name/full-plan-name.module';
import {FileEntryIndexComponent} from './file-entry-index/file-entry-index.component';
import {ImageZoomModule} from '@common/core/ui/image-zoom/image-zoom.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {LocalizationIndexComponent} from '@common/admin/localizations/localization-index.component';
import {NewLineModalComponent} from '@common/admin/localizations/new-line-modal/new-line-modal.component';
import {CrupdateLocalizationModalComponent} from '@common/admin/localizations/crupdate-localization-modal/crupdate-localization-modal.component';
import {BaseAdminRoutingModule} from '@common/admin/base-admin-routing.module';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {FindUserModalModule} from '@common/auth/find-user-modal/find-user-modal.module';
import {MaterialNavbarModule} from '@common/core/ui/material-navbar/material-navbar.module';
import {CustomMenuModule} from '@common/core/ui/custom-menu/custom-menu.module';
import {TranslationsModule} from '@common/core/translations/translations.module';
import {MatIconModule} from '@angular/material/icon';
import {FormatPipesModule} from '@common/core/ui/format-pipes/format-pipes.module';
import {NoResultsMessageModule} from '@common/core/ui/no-results-message/no-results-message.module';
import {LoadingIndicatorModule} from '@common/core/ui/loading-indicator/loading-indicator.module';
import {UploadImageControlModule} from '@common/shared/form-controls/upload-image-control/upload-image-control.module';
import {ConfirmModalModule} from '@common/core/ui/confirm-modal/confirm-modal.module';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {TagIndexComponent} from '@common/admin/tag-index/tag-index.component';
import {CrupdateTagModalComponent} from '@common/admin/tag-index/crupdate-tag-modal/crupdate-tag-modal.component';
import {SlugControlModule} from '../shared/form-controls/slug-control/slug-control.module';
import {RoleManagerModule} from './users/role-manager/role-manager.module';
import {CustomPageIndexModule} from '../pages/custom-pages-index/custom-page-index.module';
import {PlanIndexFiltersComponent} from './billing/plans/plan-index/plan-index-filters/plan-index-filters.component';
import {SubscriptionIndexFiltersComponent} from './billing/subscriptions/subscription-index/subscription-index-filters/subscription-index-filters.component';
import {BetweenDateInputModule} from '../core/ui/between-date-input/between-date-input.module';
import {UserIndexFiltersComponent} from './users/user-index-filters/user-index-filters.component';
import {FileEntryIndexFiltersComponent} from './file-entry-index/file-entry-index-filters/file-entry-index-filters.component';
import {TagIndexFiltersComponent} from './tag-index/tag-index-filters/tag-index-filters.component';
import {SelectUserInputModule} from '../core/ui/select-user-input/select-user-input.module';
import {SkeletonModule} from '../core/ui/skeleton/skeleton.module';
import {DatatableModule} from '../datatable/datatable.module';

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TextEditorModule,
        SettingsModule,
        MaterialNavbarModule,
        CustomMenuModule,
        FullPlanNameModule,
        SpaceInputModule,
        DatatableModule,
        FormatPipesModule,
        TranslationsModule,
        NoResultsMessageModule,
        LoadingIndicatorModule,
        UploadImageControlModule,
        ConfirmModalModule,
        SlugControlModule,
        RoleManagerModule,
        BaseAdminRoutingModule,
        CustomPageIndexModule,

        // material
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatDialogModule,
        MatMenuModule,
        MatSlideToggleModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatSidenavModule,
        DragDropModule,
        MatProgressBarModule,

        // for permission/role modal only
        MatExpansionModule,
        MatPseudoCheckboxModule,

        // for subscription modal and list only
        MatDatepickerModule,
        MatNativeDateModule,
        BetweenDateInputModule,
        SelectUserInputModule,

        // for ads page only
        ImageZoomModule,
        MatRippleModule,

        // for role index component
        FindUserModalModule,
        SkeletonModule,
    ],
    declarations: [
        AdminComponent,
        RoleIndexComponent,
        CrupdateRoleModalComponent,
        UserIndexComponent,
        CrupdateUserModalComponent,
        LocalizationIndexComponent,
        CrupdateLocalizationModalComponent,
        NewLineModalComponent,
        SelectRolesModalComponent,
        SelectPermissionsModalComponent,
        PermissionManagerComponent,
        AdsPageComponent,
        FileEntryIndexComponent,
        TagIndexComponent,
        CrupdateTagModalComponent,

        // billing
        PlanIndexComponent,
        PlanIndexFiltersComponent,
        SubscriptionIndexComponent,
        SubscriptionIndexFiltersComponent,
        CrupdatePlanModalComponent,
        CrupdateSubscriptionModalComponent,
        UserIndexFiltersComponent,
        FileEntryIndexFiltersComponent,
        TagIndexFiltersComponent,
    ],
    exports: [
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TextEditorModule,
        SettingsModule,
        PermissionManagerComponent,
        SelectPermissionsModalComponent,
        TranslationsModule,
        FormatPipesModule,
        ConfirmModalModule,
        DatatableModule,

        // material
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatDialogModule,
        MatMenuModule,
        MatSlideToggleModule,
        MatChipsModule,
    ],
    providers: [
        Modal,
    ]
})
export class BaseAdminModule {
    constructor(private settings: Settings) {
        this.settings.merge({vebto: COMMON_ADMIN_CONFIG});
    }
}
