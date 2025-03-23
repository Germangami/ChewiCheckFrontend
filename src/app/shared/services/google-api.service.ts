import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, timer } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

declare var gapi: any;
declare var google: any;

@Injectable({
    providedIn: 'root'
})
export class GoogleApiService {
    private readonly CLIENT_ID = environment.googleCalendar.clientId;
    private readonly API_KEY = environment.googleCalendar.apiKey;
    private readonly DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
    private readonly SCOPES = 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events';

    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    constructor() {
        this.initClient();
        this.setupTokenRefresh();
    }

    private async initClient() {
        try {
            await this.loadGapiClient();
            await gapi.client.init({
                apiKey: this.API_KEY,
                discoveryDocs: [this.DISCOVERY_DOC],
            });
            
            // Проверяем текущий токен
            const token = gapi.client.getToken();
            if (token) {
                this.isAuthenticatedSubject.next(true);
            }
            
            console.log('GAPI client initialized');
        } catch (err) {
            console.error('Error initializing GAPI client:', err);
        }
    }

    private loadGapiClient(): Promise<void> {
        return new Promise((resolve) => {
            gapi.load('client', resolve);
        });
    }

    private setupTokenRefresh() {
        // Обновляем токен каждые 45 минут (токен живет 1 час)
        timer(0, 45 * 60 * 1000).pipe(
            switchMap(() => this.refreshToken())
        ).subscribe();
    }

    private refreshToken(): Observable<boolean> {
        return new Observable(observer => {
            if (!this.isAuthenticatedSubject.value) {
                observer.next(false);
                observer.complete();
                return;
            }

            const tokenClient = this.initTokenClient();
            tokenClient.callback = (resp: any) => {
                if (resp.error) {
                    observer.error(resp);
                    return;
                }
                observer.next(true);
                observer.complete();
            };

            tokenClient.requestAccessToken({ prompt: '' });
        });
    }

    private initTokenClient() {
        return google.accounts.oauth2.initTokenClient({
            client_id: this.CLIENT_ID,
            scope: this.SCOPES,
            callback: '', // будет определен при вызове
        });
    }

    authenticate(): Observable<boolean> {
        return new Observable(observer => {
            const tokenClient = this.initTokenClient();
            tokenClient.callback = (resp: any) => {
                if (resp.error) {
                    observer.error(resp);
                    return;
                }
                this.isAuthenticatedSubject.next(true);
                observer.next(true);
                observer.complete();
            };
            
            if (gapi.client.getToken() === null) {
                tokenClient.requestAccessToken({ prompt: 'consent' });
            } else {
                tokenClient.requestAccessToken({ prompt: '' });
            }
        });
    }

    signOut(): void {
        const token = gapi.client.getToken();
        if (token !== null) {
            google.accounts.oauth2.revoke(token.access_token);
            gapi.client.setToken('');
            this.isAuthenticatedSubject.next(false);
        }
    }
}
