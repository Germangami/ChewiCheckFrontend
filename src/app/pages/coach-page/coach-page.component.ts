import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, TrackByFunction } from '@angular/core';
import { Client, ClientType } from '../../shared/Model/ClientModel/client-model';
import { CommonModule } from '@angular/common';
import { combineLatest, map, Observable, startWith, Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { ClientSelectors } from '../../state/client/client.selectors';
import { MatExpansionModule } from '@angular/material/expansion';
import { GetAllClients, UpdatePagination } from '../../state/client/client.actions';
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

export interface PaginationConfig {
  pageSize: number;
  currentPage: number;
}

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
export class CoachPageComponent {

   // Переместите инициализацию vm$ в конструктор
   vm$: Observable<{
    groupClients: Client[];
    individualClients: Client[];
    pagination: PaginationConfig;
  }>;

  pageSizeOptions = [5, 10, 25, 100];
  trackById: TrackByFunction<Client> = (_, client) => client._id;

  constructor(private store: Store) {
    // Инициализируйте vm$ после получения store
    this.vm$ = combineLatest([
      this.store.select(ClientSelectors.getFilteredClients).pipe(
          startWith([]) // Защита от undefined
      ),
      this.store.select(ClientSelectors.getPaginationConfig).pipe(
          startWith({ pageSize: 10, currentPage: 0 })
      )
  ]).pipe(
      map(([filteredClients, pagination]) => ({
          groupClients: this.filterByType(filteredClients, ClientType.GROUP),
          individualClients: this.filterByType(filteredClients, ClientType.INDIVIDUAL),
          pagination
      }))
  );

    this.store.dispatch(new GetAllClients());
  }

  // Остальной код без изменений
  onPageChange(event: PageEvent): void {
    this.store.dispatch(new UpdatePagination({
      pageSize: event.pageSize,
      currentPage: event.pageIndex
    }));
  }

  private filterByType(clients: Client[], type: ClientType): Client[] {
    return clients.filter(client => client.clientType === type);
  }
}
