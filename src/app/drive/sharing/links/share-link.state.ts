import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { ShareableLinkOptions } from './models/shareable-link-options';
import { ShareableLinksApiService } from './shareable-links-api.service';
import { ShareableLink } from './models/shareable-link';
import { finalize, tap } from 'rxjs/operators';
import { DriveState } from '../../state/drive-state';
import { Settings } from '@common/core/config/settings.service';
import {
    BackendErrorMessages, BackendErrorResponse
} from '@common/core/types/backend-error-response';
import { Injectable } from '@angular/core';

export interface ShareLinkStateModel {
    cache: {[key: number]: ShareableLink};
    backendErrors: BackendErrorMessages;
    link: ShareableLink;
    loading: boolean;
    linkOptions: ShareableLinkOptions;
    optionsPanelVisible: boolean;
}

export class LoadShareableLink {
    static readonly type = '[Shareable Link] Load From Backend';
    constructor(public options: {autoCreate?: boolean} = {}) {}
}

export class UpdateShareableLink {
    static readonly type = '[Shareable Link] Update';
    constructor(public options: ShareableLinkOptions) {}
}

export class CreateShareableLink {
    static readonly type = '[Shareable Link] Create';
    constructor(public options: ShareableLinkOptions) {}
}

export class DeleteShareableLink {
    static readonly type = '[Shareable Link] Delete';
}

export class ToggleOptionsPanel {
    static readonly type = '[Shareable Link] Toggle Options Panel Visibility';
}

export class LinkCopySuccess {
    static readonly type = '[Shareable Link] Copy To Clipboard Success';
}

export class ResetShareLinkState {
    static readonly type = '[Shareable Link] Reset State';
}

const defaultState = {
    link: null,
    loading: false,
    optionsPanelVisible: true,
    backendErrors: {},
    cache: {},
    linkOptions: {
        allowDownload: false,
        allowEdit: false,
        expiresAt: null,
        password: null,
    }
};

@State<ShareLinkStateModel>({
    name: 'shareLink',
    defaults: defaultState
})
@Injectable()
export class ShareLinkState {
    constructor(
        private store: Store,
        private settings: Settings,
        private linksApi: ShareableLinksApiService
    ) {}

    @Selector()
    static loading(state: ShareLinkStateModel) {
        return state.loading;
    }

    @Selector()
    static link(state: ShareLinkStateModel) {
        return state.link;
    }

    @Selector()
    static optionsVisible(state: ShareLinkStateModel) {
        return ! state.loading && state.optionsPanelVisible;
    }

    @Selector()
    static backendErrors(state: ShareLinkStateModel) {
        return state.backendErrors;
    }

    @Action(CreateShareableLink)
    createShareableLink(ctx: StateContext<ShareLinkStateModel>, action: UpdateShareableLink) {
        const entryId = this.store.selectSnapshot(DriveState.selectedEntryIds)[0];

        ctx.patchState({loading: true});

        return this.linksApi.create(entryId, action.options)
            .pipe(
                finalize(() => ctx.patchState({loading: false, backendErrors: {}})),
                tap(response => {
                    const link = response.link;
                    ctx.patchState({
                        cache: {...ctx.getState().cache, [link.entry_id]: link},
                        link: response.link,
                        optionsPanelVisible: false
                    });
                }, (errorResponse: BackendErrorResponse) => {
                    ctx.patchState({backendErrors: errorResponse.errors});
                })
            );
    }

    @Action(UpdateShareableLink)
    updateLink(ctx: StateContext<ShareLinkStateModel>, action: UpdateShareableLink) {
        const link = ctx.getState().link;

        ctx.patchState({loading: true});

        return this.linksApi.update(link.id, action.options)
            .pipe(
                finalize(() => ctx.patchState({loading: false, backendErrors: {}})),
                tap(response => ctx.patchState({
                    link: response.link,
                    cache: {...ctx.getState().cache, [link.entry_id]: response.link},
                    optionsPanelVisible: false
                }), (errorResponse: BackendErrorResponse) => {
                    ctx.patchState({backendErrors: errorResponse.errors});
                })
            );
    }

    @Action(LoadShareableLink)
    loadShareableLink(ctx: StateContext<ShareLinkStateModel>, action: LoadShareableLink) {
        const entryId = this.store.selectSnapshot(DriveState.selectedEntryIds)[0],
            cachedLink = ctx.getState().cache[entryId];

        if (cachedLink) {
            return ctx.patchState({link: cachedLink, optionsPanelVisible: false});
        }

        ctx.patchState({loading: true});

        return this.linksApi.findByEntryId(entryId, {autoCreate: action.options.autoCreate})
            .pipe(
                finalize(() => ctx.patchState({loading: false})),
                tap(response => ctx.patchState({
                    link: response.link,
                    optionsPanelVisible: false,
                    cache: {...ctx.getState().cache, [response.link.entry_id]: response.link},
                }), () => {})
            );
    }

    @Action(DeleteShareableLink)
    deleteShareableLink(ctx: StateContext<ShareLinkStateModel>) {
        const link = ctx.getState().link;

        ctx.patchState({loading: true});

        return this.linksApi.delete(link.id)
            .pipe(
                finalize(() => ctx.patchState({loading: false})),
                tap(() => {
                    const cache = ctx.getState().cache;
                    delete cache[link.entry_id];

                    ctx.patchState({
                        link: null,
                        cache: cache,
                    });
                })
            );
    }

    @Action(ToggleOptionsPanel)
    toggleOptionsPanel(ctx: StateContext<ShareLinkStateModel>) {
        ctx.patchState({
           optionsPanelVisible: !ctx.getState().optionsPanelVisible
        });
    }

    @Action(ResetShareLinkState, {cancelUncompleted: true})
    resetShareLinkState(ctx: StateContext<ShareLinkStateModel>) {
        return ctx.patchState({...ctx.getState(), ...defaultState});
    }
}
