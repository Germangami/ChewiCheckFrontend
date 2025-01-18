import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { Client } from '../../shared/Model/ClientModel/client-model';
import { ClientInfoComponent } from "./client-info/client-info.component";
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { ClientSelectors } from '../../state/client/client.selectors';
import { MatExpansionModule } from '@angular/material/expansion';
import { GetAllClients } from '../../state/client/client.actions';
import { WebSocketService } from '../../shared/services/web-socket.service';

@Component({
    selector: 'app-coach-page',
    templateUrl: './coach-page.component.html',
    styleUrl: './coach-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [ClientInfoComponent, CommonModule, MatExpansionModule]
})
export class CoachPageComponent implements OnInit {
  clients$: Observable<Client[]>;

  constructor(private apiService: ApiService, 
              private cdr: ChangeDetectorRef, 
              private store: Store,
              private webSocketService: WebSocketService) {

  }

  ngOnInit(): void {
    this.store.dispatch(new GetAllClients).subscribe();
    this.clients$ = this.store.select(ClientSelectors.getUsers);
    this.cdr.detectChanges();
    this.updateClientDataWebSocket();
  }

  updateClientDataWebSocket() {
		return this.webSocketService.onClientUpdated().subscribe((updatedClient: Client) => {
			console.log(updatedClient, 'UPDATE CLIENT COACH-PAGE')
			// if (updatedClient._id === this.currentClient._id) {
			// 	this.currentClient = {...updatedClient};
			// 		this.cdr.detectChanges();
			// }
		});
	}
  
}
