import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Client } from '../../shared/Model/ClientModel/client-model';
import { ClientInfoComponent } from "./client-info/client-info.component";
import { CommonModule } from '@angular/common';
import { Observable, map, take } from 'rxjs';
import { Store } from '@ngxs/store';
import { ClientSelectors } from '../../state/client/client.selectors';
import { MatExpansionModule } from '@angular/material/expansion';
import { ChangeClientData, GetAllClients } from '../../state/client/client.actions';
import { WebSocketService } from '../../shared/services/web-socket.service';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';

@Component({
    selector: 'app-coach-page',
    templateUrl: './coach-page.component.html',
    styleUrl: './coach-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
      ClientInfoComponent, 
      CommonModule, 
      MatExpansionModule, 
      MatPaginatorModule,
      MatFormFieldModule,
      MatIconModule,
      MatInputModule
    ]
})
export class CoachPageComponent implements OnInit {
  clients$: Observable<Client[]>; // Исходные клиенты
  paginatedClients$: Observable<Client[]>; // Отфильтрованные клиенты для текущей страницы
  totalClientsLength: number = 0; // Общее число клиентов
  pageSize: number = 10; // Количество записей на страницу
  currentPage: number = 0; // Текущая страница
  filterValue: string = ''; // Хранит текущее значение фильтра
  filteredClients$: Observable<Client[]>; // Хранит список отфильтрованных клиентов
  filteredClientsLength: number = 0; // Количество отфильтрованных клиентов

  constructor(private cdr: ChangeDetectorRef, 
              private store: Store,
              private webSocketService: WebSocketService) {

  }

  ngOnInit(): void {
    this.store.dispatch(new GetAllClients).subscribe();
    this.clients$ = this.store.select(ClientSelectors.getUsers);
    this.clients$.subscribe((clients) => {
      this.totalClientsLength = clients.length; // Обновляем общее число клиентов
    });

    this.filteredClients$ = this.clients$.pipe(
      map((clients) => {
        this.filteredClientsLength = clients.length; // Изначально отображаем всех клиентов
        return clients;
      })
    );

    this.paginatedClients$ = this.clients$.pipe(
      map((clients) =>
        clients.slice(this.currentPage * this.pageSize, this.currentPage * this.pageSize + this.pageSize)
      )
    );
    this.updateClientDataWebSocket();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.paginatedClients$ = this.clients$.pipe(
      map((clients) =>
        clients.slice(this.currentPage * this.pageSize, this.currentPage * this.pageSize + this.pageSize)
      )
    );
  }

  onFilterChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filterValue = input.value.toLowerCase();
  
    this.filteredClients$ = this.clients$.pipe(
      map((clients) =>
        clients.filter((client) => {
          const firstName = client.first_name?.toLowerCase() || ''; // Проверяем first_name
          const nickname = client.nickname?.toLowerCase() || '';   // Проверяем nickname
          return firstName.includes(this.filterValue) || nickname.includes(this.filterValue);
        })
      )
    );
  
    this.filteredClients$.subscribe((clients) => {
      this.filteredClientsLength = clients.length; // Обновляем количество отфильтрованных клиентов
    });
  
    this.paginatedClients$ = this.filteredClients$.pipe(
      map((clients) =>
        clients.slice(this.currentPage * this.pageSize, this.currentPage * this.pageSize + this.pageSize)
      )
    );
  }

  updateClientDataWebSocket() {
		return this.webSocketService.onClientUpdated().pipe(take(1)).subscribe((updatedClient: Client) => {
			console.log(updatedClient, 'UPDATE CLIENT COACH-PAGE')
      this.store.dispatch(new ChangeClientData(updatedClient));
		});
	}
  
}
