// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MatCardModule } from '@angular/material/card';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { GoogleCalendarService } from '../../shared/services/google-calendar.service';
// import { ScheduleCalendarComponent } from './schedule-calendar.component';

// @Component({
//     selector: 'app-schedule-setting',
//     standalone: true,
//     imports: [
//         CommonModule,
//         MatCardModule,
//         MatButtonModule,
//         MatIconModule,
//         ScheduleCalendarComponent
//     ],
//     template: `
//         <div class="settings-container">
//             <mat-card class="connection-card">
//                 <mat-card-header>
//                     <mat-card-title>Ustawienia Kalendarza</mat-card-title>
//                 </mat-card-header>
//                 <mat-card-content>
//                     <div class="calendar-status">
//                         <p>Status połączenia z Google Calendar: 
//                             <span [class.connected]="isConnected">
//                                 {{isConnected ? 'Połączono' : 'Nie połączono'}}
//                             </span>
//                         </p>
//                     </div>
//                 </mat-card-content>
//                 <mat-card-actions>
//                     <button mat-raised-button color="primary" (click)="toggleConnection()">
//                         <mat-icon>{{isConnected ? 'link_off' : 'link'}}</mat-icon>
//                         {{isConnected ? 'Odłącz kalendarz' : 'Połącz z kalendarzem Google'}}
//                     </button>
//                 </mat-card-actions>
//             </mat-card>

//             @if (isConnected) {
//                 <app-schedule-calendar></app-schedule-calendar>
//             }
//         </div>
//     `,
//     styles: [`
//         .settings-container {
//             display: flex;
//             flex-direction: column;
//             gap: 24px;
//             padding: 24px;
//             max-width: 800px;
//             margin: 0 auto;
//         }

//         .connection-card {
//             .calendar-status {
//                 margin: 16px 0;
                
//                 .connected {
//                     color: #4CAF50;
//                     font-weight: 500;
//                 }
//             }

//             mat-card-actions {
//                 padding: 16px;
//             }

//             button {
//                 mat-icon {
//                     margin-right: 8px;
//                 }
//             }
//         }
//     `]
// })
// export class ScheduleSettingComponent implements OnInit {
//     isConnected = false;

//     constructor(
//         private googleCalendarService: GoogleCalendarService,
//         private snackBar: MatSnackBar
//     ) {}

//     ngOnInit() {
//         this.googleCalendarService.isSignedInObservable().subscribe(
//             signedIn => this.isConnected = signedIn
//         );
//     }

//     async toggleConnection() {
//         try {
//             if (this.isConnected) {
//                 await this.googleCalendarService.signOut();
//                 this.snackBar.open('Pomyślnie odłączono od Google Calendar', 'OK', { duration: 3000 });
//             } else {
//                 await this.googleCalendarService.signIn();
//                 this.snackBar.open('Pomyślnie połączono z Google Calendar', 'OK', { duration: 3000 });
//             }
//         } catch (error) {
//             console.error('Error toggling calendar connection', error);
//             this.snackBar.open('Wystąpił błąd podczas łączenia z kalendarzem', 'OK', { duration: 3000 });
//         }
//     }
// } 