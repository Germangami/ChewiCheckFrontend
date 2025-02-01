import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CurrentClientViewComponent } from "./current-client-view/current-client-view.component";
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { Client } from '../../shared/Model/ClientModel/client-model';
import { WebSocketService } from '../../shared/services/web-socket.service';
import { Subscription } from 'rxjs';
import { CurrentClientTraningsComponent } from './current-client-tranings/current-client-tranings.component';
import { Store } from '@ngxs/store';
import { ClientSelectors } from '../../state/client/client.selectors';
import { ClientStatisticsComponent } from './client-statistics/client-statistics.component';

@Component({
    selector: 'app-client-page',
    templateUrl: './client-page.component.html',
    styleUrl: './client-page.component.scss',
    standalone: true,
    imports: [CurrentClientViewComponent, CurrentClientTraningsComponent, ClientStatisticsComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientPageComponent implements OnInit, OnDestroy {

	currentClient: Client;
	subscription: Subscription = new Subscription();

	constructor(private activatedRoute: ActivatedRoute, 
							private apiService: ApiService, 
							private cdr: ChangeDetectorRef,
							private webSocketService: WebSocketService,
							private store: Store) {
							}

	ngOnInit(): void {
		this.subscription.add(this.getRoute());
		this.subscription.add(
			this.store.select(ClientSelectors.getUsers).subscribe(clients => {
				if (this.currentClient) {
					const updatedClient = clients.find(c => c._id === this.currentClient._id);
					if (updatedClient) {
						this.currentClient = updatedClient;
						this.cdr.detectChanges();
					}
				}
			})
		);
		this.subscription.add(
			this.webSocketService.onClientUpdated().subscribe((updatedClient: Client) => {
				console.log(updatedClient, 'UPDATE CLIENT CLIENT-PAGE');
				if (updatedClient._id === this.currentClient._id) {
					this.currentClient = {...updatedClient};
					this.cdr.detectChanges();
				}
			})
		);
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	getRoute() {
		const tgId = this.activatedRoute.snapshot.paramMap.get('id');
		if (tgId) {
				return this.apiService.getCurrentClient(tgId).subscribe({
						next: (response) => {
								this.currentClient = response;
								this.cdr.detectChanges();
						},
						error: (error) => {
								console.log(error, 'ERROR ClientPageComponent');
						}
				});
		}
		return new Subscription();
	}
}
