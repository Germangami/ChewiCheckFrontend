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
import { Subscription } from 'rxjs';

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
  @Input() clients: Client[] = [];
  @Output() filteredClients = new EventEmitter<Client[]>();
  
  formGroup: FormGroup;
  searchValue: string = '';
  subscription = new Subscription();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initFormGroup();
    this.subscription.add(this.formGroupChanges());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      active: [false],
      expired: [false],
      expiringSoon: [false],
    });
  }

  formGroupChanges() {
    return this.formGroup.valueChanges.subscribe(() => this.applyFilters());
  }

  onFilterChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchValue = input.value.toLowerCase();
    this.applyFilters();
  }

  isExpiringSoon(client: Client): boolean {
    if (!client.groupTraining.endDate) return false;
    const currentDate = new Date();
    const endDate = new Date(client.groupTraining.endDate);
    const daysUntilExpiration = Math.floor((endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration <= 3 && daysUntilExpiration >= 0;
  }

  private applyFilters() {
    const filteredClients = this.clients.filter(client => {
      const firstName = client.first_name?.toLowerCase() || '';
      const nickname = client.nickname?.toLowerCase() || '';
      const matchesSearch = !this.searchValue || 
          firstName.includes(this.searchValue) || 
          nickname.includes(this.searchValue);

      if (!matchesSearch) return false;

      const { active, expired, expiringSoon } = this.formGroup.value;
      const noFiltersSelected = !active && !expired && !expiringSoon;

      if (noFiltersSelected) return true;

      return (
          (active && client.groupTraining.isActive) ||
          (expired && !client.groupTraining.isActive) ||
          (expiringSoon && this.isExpiringSoon(client))
      );
    });

    this.filteredClients.emit(filteredClients);
  }
}
