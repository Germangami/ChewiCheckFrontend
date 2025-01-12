import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CurrentClientViewComponent } from "./current-client-view/current-client-view.component";
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { Client } from '../../shared/Model/ClientModel/client-model';

@Component({
    selector: 'app-client-page',
    templateUrl: './client-page.component.html',
    styleUrl: './client-page.component.scss',
    standalone: true,
    imports: [CurrentClientViewComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientPageComponent implements OnInit {

    currentClient: Client;

    constructor(private activatedRoute: ActivatedRoute, private apiService: ApiService, private cdr: ChangeDetectorRef) {

    }

    ngOnInit(): void {
        const tgId = this.activatedRoute.snapshot.paramMap.get('id');
        if (tgId) {
            this.apiService.getCurrentClient(tgId).subscribe({
                next: (response) => {
                    console.log(response, 'GET CURRENT CLIENT!')
                    this.currentClient = response;
                    this.cdr.detectChanges();
                },
                error: (error) => {
                    console.log(error, 'ERROR ClientPageComponent')
                }
            })
        }
    }

}
