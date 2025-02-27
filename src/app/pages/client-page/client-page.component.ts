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
import { IndiviualClientViewComponent } from './indiviual-client-view/indiviual-client-view.component';
import { GetTrainer } from '../../state/trainer/trainer.actions';

@Component({
    selector: 'app-client-page',
    templateUrl: './client-page.component.html',
    styleUrl: './client-page.component.scss',
    standalone: true,
    imports: [
		CurrentClientViewComponent, 
		CurrentClientTraningsComponent, 
		ClientStatisticsComponent,
		IndiviualClientViewComponent
	],
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
		this.apiService.getCurrentClient(469408413).subscribe(response => {
			this.store.dispatch(new GetTrainer(response.trainerId));
		})
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
				if (updatedClient._id === this.currentClient._id) {
					this.currentClient = {...updatedClient};
					this.cdr.detectChanges();
				}
			})
		);
		const tgId = 469408413;
		
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
								console.error('Error getting client:', error);
						}
				});
		}
		return new Subscription();
	}
}
