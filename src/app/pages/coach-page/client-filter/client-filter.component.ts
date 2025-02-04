import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { Client } from '../../../shared/Model/ClientModel/client-model';
import { debounceTime, distinctUntilChanged, Subject, Subscription, takeUntil } from 'rxjs';
import { Store } from '@ngxs/store';
import { SetSearchFilter, SetStatusFilter } from '../../../state/client/client.actions';

@Component({
  selector: 'app-client-filter',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './client-filter.component.html',
  styleUrl: './client-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientFilterComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
  filterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      active: [false],
      expired: [false],
      expiringSoon: [false]
    });
  }

  ngOnInit() {
    this.setupFormListeners();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupFormListeners() {
    // Search with debounce
    this.filterForm.get('search')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(search => {
      this.store.dispatch(new SetSearchFilter(search?.toString() || ''));
    });

    // Status filters
    this.filterForm.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(filters => {
      this.store.dispatch(new SetStatusFilter({
        active: !!filters.active,
        expired: !!filters.expired,
        expiringSoon: !!filters.expiringSoon
      }));
    });
  }
}
