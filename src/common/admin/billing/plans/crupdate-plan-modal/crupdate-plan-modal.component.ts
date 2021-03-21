import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Plan} from '@common/core/types/models/Plan';
import {Plans} from '@common/shared/billing/plans.service';
import {Currency, ValueLists} from '@common/core/services/value-lists.service';
import {Toast} from '@common/core/ui/toast.service';
import {randomString} from '@common/core/utils/random-string';
import {finalize} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {BackendErrorResponse} from '@common/core/types/backend-error-response';

export interface CrupdatePlanModalData {
    plan?: Plan;
    plans: Plan[];
}

interface Errors extends Partial<Plan> {
    general?: string;
}

@Component({
    selector: 'crupdate-plan-modal',
    templateUrl: './crupdate-plan-modal.component.html',
    styleUrls: ['./crupdate-plan-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrupdatePlanModalComponent implements OnInit {
    public loading$ = new BehaviorSubject(false);
    public newFeature: string;
    public features$ = new BehaviorSubject<{content: string, id: string}[]>([]);
    public errors$ = new BehaviorSubject<Errors>({});
    public currencies$ = new BehaviorSubject<Currency[]>([]);
    public intervals = ['day', 'week', 'month', 'year'];
    private allPlans$ = new BehaviorSubject<Plan[]>([]);
    public form = this.fb.group({
        name: [''],
        parent_id: [],
        free: [false],
        hidden: [false],
        recommended: [false],
        show_permissions: [false],
        amount: [],
        currency: [],
        interval: [],
        interval_count: [],
        position: [],
        available_space: [],
        permissions: [[]],
    });

    constructor(
        private dialogRef: MatDialogRef<CrupdatePlanModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CrupdatePlanModalData,
        public plans: Plans,
        private toast: Toast,
        private valueLists: ValueLists,
        private fb: FormBuilder,
    ) {}

    ngOnInit() {
        this.resetState();
        this.allPlans$.next(this.data.plans || []);

        this.valueLists.get(['currencies']).subscribe(response => {
            this.currencies$.next(Object.values(response.currencies));
        });

        if (this.data.plan) {
            this.hydrateModel(this.data.plan);
        }
    }

    public confirm() {
        this.loading$.next(true);
        let request;

        if (this.data.plan) {
            request = this.plans.update(this.data.plan.id, this.getPayload());
        } else {
            request = this.plans.create(this.getPayload());
        }

        request
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                this.close(response.plan);
                const action = this.data.plan ? 'updated' : 'created';
                this.toast.open('Plan has been ' + action);
            }, (errResponse: BackendErrorResponse) => {
                this.errors$.next(errResponse.errors);
            });
    }

    public getPayload() {
        const payload = {...this.form.getRawValue()};
        payload.features = this.features$.value.map(feature => feature.content);

        const currency = this.currencies$.value.find(curr => curr.code === payload.currency);
        payload.currency_symbol = currency.symbol;

        if (payload.interval === 'year') {
            payload.interval_count = 1;
        }

        return payload;
    }

    public close(data?: Plan) {
        this.resetState();
        this.dialogRef.close(data);
    }

    public addFeature() {
        const exists = this.features$.value.findIndex(curr => curr.content === this.newFeature) > -1;
        if (exists || ! this.newFeature) return;
        this.features$.next([...this.features$.value, {content: this.newFeature, id: randomString(5)}]);
        this.newFeature = null;
    }

    public removeFeature(feature: {content: string, id: string}) {
        const newFeatures = this.features$.value.filter(f => f.id !== feature.id);
        this.features$.next(newFeatures);
    }

    public getBasePlans(planToSkip?: Plan): Plan[] {
        return this.allPlans$.value.filter(p => !p.parent_id && !p.free && (!planToSkip || planToSkip.id !== p.id));
    }

    private hydrateModel(plan: Plan) {
        this.form.patchValue(plan);
        const newFeatures = plan.features.map(feature => {
            return {content: feature, id: randomString(5)};
        });
        this.form.get('amount').disable();
        this.features$.next(newFeatures);
    }

    private resetState() {
        this.form.reset({
            currency: 'USD',
            interval: 'month',
            interval_count: 1,
            position: 1,
            permissions: [],
            free: false,
            recommended: false,
            show_permissions: false,
        });
        this.features$.next([]);
        this.errors$.next({});
    }

    public reorderPlanFeatures(e: CdkDragDrop<void>) {
        const newFeatures = [...this.features$.value];
        moveItemInArray(newFeatures, e.previousIndex, e.currentIndex);
        this.features$.next(newFeatures);
    }

    public formValue() {
        return this.form.value as Partial<Plan>;
    }

    public getMinAmount(): number {
        // child plans can't be set as free,
        // so should have amount more then 0
        return this.form.get('parent_id').value ? 1 : 0;
    }

    public getMaxAmount(): number {
        if (this.form.get('parent_id').value) {
            // child plan amount per interval should be cheaper then parent
            const parent = this.allPlans$.value.find(p => p.id === this.form.get('parent_id').value);
            return ((parent.amount / parent.interval_count) * this.form.get('interval_count').value) - 0.01;
        } else {
            return null;
        }
    }
}
