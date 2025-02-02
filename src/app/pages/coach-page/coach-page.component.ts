import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Client } from '../../shared/Model/ClientModel/client-model';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { ClientSelectors } from '../../state/client/client.selectors';
import { MatExpansionModule } from '@angular/material/expansion';
import { GetAllClients } from '../../state/client/client.actions';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import { GroupClientsComponent } from './group-clients/group-clients.component';
import { IndividualClientsComponent } from './individual-clients/individual-clients.component';
import { ClientFilterComponent } from './client-filter/client-filter.component';

@Component({
    selector: 'app-coach-page',
    templateUrl: './coach-page.component.html',
    styleUrl: './coach-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
      CommonModule, 
      MatExpansionModule, 
      MatPaginatorModule,
      MatFormFieldModule,
      MatIconModule,
      MatInputModule,
      MatButtonModule,
      MatButtonModule,
      MatMenuModule,
      MatCheckboxModule, 
      FormsModule,
      ReactiveFormsModule,
      MatTooltipModule,
      MatTabsModule,
      GroupClientsComponent,
      IndividualClientsComponent,
      ClientFilterComponent
    ]
})
export class CoachPageComponent implements OnInit, OnDestroy {

  clients$: Observable<Client[]>;
  filteredClients: Client[] = [];
  searchValue: string = '';

  formGroup: FormGroup;

  pageConfig = {
    totalLength: 0,
    filteredLength: 0,
    pageSize: 10,
    currentPage: 0
  };

  subscription: Subscription = new Subscription();

  constructor(
    private store: Store, 
    private fb: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.subscription.add(this.initializeData());
    this.subscription.add(this.initFormGroup());
    this.subscription.add(this.formGroupChanges());
  }

  ngOnDestroy(): void {
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
    // return this.formGroup.valueChanges.subscribe(() => this.applyFilters());
  }

  initializeData() {
    this.store.dispatch(new GetAllClients);
    this.clients$ = this.store.select(ClientSelectors.getUsers);
    return this.clients$.subscribe(clients => {
      this.filteredClients = clients;
      this.pageConfig.filteredLength = clients.length;
    });
  }

  onFilteredClientsChange(clients: Client[]) {
    this.filteredClients = clients;
    this.pageConfig.filteredLength = clients.length;
    this.pageConfig.currentPage = 0;
  }

  onPageChange(event: PageEvent): void {
    this.pageConfig.pageSize = event.pageSize;
    this.pageConfig.currentPage = event.pageIndex;
  }

  get paginatedClients(): Client[] {
    const startIndex = this.pageConfig.currentPage * this.pageConfig.pageSize;
    return this.filteredClients.slice(startIndex, startIndex + this.pageConfig.pageSize);
  }
}
