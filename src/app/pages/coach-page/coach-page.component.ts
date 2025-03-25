import { ChangeDetectionStrategy, Component, OnInit, TrackByFunction } from '@angular/core';
import { Client, ClientType } from '../../shared/Model/ClientModel/client-model';
import { CommonModule } from '@angular/common';
import { combineLatest, map, Observable, startWith, tap } from 'rxjs';
import { Store } from '@ngxs/store';
import { ClientSelectors } from '../../state/client/client.selectors';
import { MatExpansionModule } from '@angular/material/expansion';
import { UpdatePagination } from '../../state/client/client.actions';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { GroupClientsComponent } from './group-clients/group-clients.component';
import { IndividualClientsComponent } from './individual-clients/individual-clients.component';
import { ClientFilterComponent } from './client-filter/client-filter.component';
import { Trainer } from '../../shared/Model/TrainerModel/trainer-model';
import { ApiService } from '../../shared/services/api.service';
import { ScheduleSettingsComponent } from './schedule-settings/schedule-settings.component';
import { TrainerSelectors } from '../../state/trainer/trainer.selectors';

export interface PaginationConfig {
    pageSize: number;
    currentPage: number;
}

export interface CoachViewModel {
    trainer: Trainer | null;
    groupClients: Client[];
    individualClients: Client[];
    pagination: PaginationConfig;
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
        ClientFilterComponent,
    ]
})
export class CoachPageComponent implements OnInit {
    vm$: Observable<CoachViewModel>;
    pageSizeOptions = [5, 10, 25, 100];
    trackById: TrackByFunction<Client> = (_, client) => client._id;

    currentTrainer: Trainer | null = null;

    constructor(
        private store: Store,
        private apiService: ApiService
    ) { }

    ngOnInit(): void {
        this.getVm();
    }

    onPageChange(event: PageEvent): void {
        this.store.dispatch(new UpdatePagination({
            pageSize: event.pageSize,
            currentPage: event.pageIndex
        }));
    }

    private getVm() {
        this.vm$ = combineLatest([
            this.store.select(TrainerSelectors.getTrainer).pipe(
                startWith(null),
                tap(currentTrainer => this.currentTrainer = currentTrainer)
            ),
            this.store.select(ClientSelectors.getFilteredClients).pipe(startWith([])),
            this.store.select(ClientSelectors.getPaginationConfig).pipe(startWith({ pageSize: 10, currentPage: 0 }))
        ]).pipe(
            map(([trainer, clients, pagination]) => {
                const trainerClients = clients.filter(client => 
                    client.trainerId === trainer?.tgId
                );

                return {
                    trainer,
                    groupClients: this.filterByType(trainerClients, ClientType.GROUP),
                    individualClients: this.filterByType(trainerClients, ClientType.INDIVIDUAL),
                    pagination
                };
            })
        );
    }

    private filterByType(clients: Client[], type: ClientType): Client[] {
        return clients.filter(client => client.clientType === type);
    }
}
