// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MatCardModule } from '@angular/material/card';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatDialogModule, MatDialog } from '@angular/material/dialog';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { GoogleCalendarService } from '../../shared/services/google-calendar.service';
// import { FormsModule } from '@angular/forms';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { Subscription } from 'rxjs';

// @Component({
//     selector: 'app-schedule-calendar',
//     standalone: true,
//     imports: [
//         CommonModule,
//         MatCardModule,
//         MatButtonModule,
//         MatIconModule,
//         MatDialogModule,
//         FormsModule,
//         MatFormFieldModule,
//         MatInputModule,
//         MatDatepickerModule,
//         MatNativeDateModule,
//         MatProgressSpinnerModule
//     ],
//     template: `
//         <mat-card>
//             <mat-card-header>
//                 <mat-card-title>Zarządzanie przerwami</mat-card-title>
//             </mat-card-header>
//             <mat-card-content>
//                 @if (isLoading) {
//                     <div class="loading-spinner">
//                         <mat-spinner diameter="40"></mat-spinner>
//                         <p>Ładowanie kalendarza...</p>
//                     </div>
//                 } @else {
//                     <div class="break-form">
//                         <mat-form-field>
//                             <mat-label>Data przerwy</mat-label>
//                             <input matInput [matDatepicker]="picker" [(ngModel)]="breakDate">
//                             <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
//                             <mat-datepicker #picker></mat-datepicker>
//                         </mat-form-field>

//                         <mat-form-field>
//                             <mat-label>Czas rozpoczęcia</mat-label>
//                             <input matInput type="time" [(ngModel)]="startTime">
//                         </mat-form-field>

//                         <mat-form-field>
//                             <mat-label>Czas zakończenia</mat-label>
//                             <input matInput type="time" [(ngModel)]="endTime">
//                         </mat-form-field>

//                         <mat-form-field>
//                             <mat-label>Opis</mat-label>
//                             <input matInput [(ngModel)]="description" placeholder="Powód przerwy">
//                         </mat-form-field>
//                     </div>

//                     <div class="calendar-events" *ngIf="events.length > 0">
//                         <h3>Zaplanowane przerwy:</h3>
//                         <div class="event-list">
//                             @for(event of events; track event.id) {
//                                 <div class="event-item">
//                                     <span class="event-title">{{event.summary}}</span>
//                                     <span class="event-time">
//                                         {{formatDate(event.start.dateTime)}} - {{formatDate(event.end.dateTime)}}
//                                     </span>
//                                     <span class="event-description">{{event.description}}</span>
//                                 </div>
//                             }
//                         </div>
//                     </div>
//                 }
//             </mat-card-content>
//             <mat-card-actions>
//                 <button mat-raised-button color="primary" 
//                         (click)="addBreak()" 
//                         [disabled]="!isFormValid() || isLoading">
//                     <mat-icon>add</mat-icon>
//                     Dodaj przerwę
//                 </button>
//                 <button mat-raised-button 
//                         (click)="refreshEvents()"
//                         [disabled]="isLoading">
//                     <mat-icon>refresh</mat-icon>
//                     Odśwież
//                 </button>
//             </mat-card-actions>
//         </mat-card>
//     `,
//     styles: [`
//         .break-form {
//             display: flex;
//             flex-direction: column;
//             gap: 16px;
//             margin-bottom: 24px;
//         }

//         .calendar-events {
//             margin-top: 24px;

//             h3 {
//                 margin-bottom: 16px;
//                 color: #333;
//             }
//         }

//         .event-list {
//             display: flex;
//             flex-direction: column;
//             gap: 12px;
//         }

//         .event-item {
//             padding: 12px;
//             border: 1px solid #e0e0e0;
//             border-radius: 4px;
//             background-color: #f8f8f8;

//             display: flex;
//             flex-direction: column;
//             gap: 4px;

//             .event-title {
//                 font-weight: 500;
//                 color: #333;
//             }

//             .event-time {
//                 color: #666;
//                 font-size: 0.9em;
//             }

//             .event-description {
//                 color: #777;
//                 font-size: 0.9em;
//             }
//         }

//         mat-card-actions {
//             display: flex;
//             gap: 8px;
//             padding: 16px;
//         }

//         .loading-spinner {
//             display: flex;
//             flex-direction: column;
//             align-items: center;
//             justify-content: center;
//             padding: 32px;
//             gap: 16px;

//             p {
//                 color: #666;
//                 margin: 0;
//             }
//         }
//     `]
// })
// export class ScheduleCalendarComponent implements OnInit, OnDestroy {
//     breakDate: Date = new Date();
//     startTime: string = '';
//     endTime: string = '';
//     description: string = '';
//     events: any[] = [];
//     isLoading = false;
//     private authSubscription?: Subscription;

//     constructor(
//         private googleCalendarService: GoogleCalendarService,
//         private snackBar: MatSnackBar
//     ) {}

//     ngOnInit() {
//         this.authSubscription = this.googleCalendarService.isSignedInObservable().subscribe(
//             isSignedIn => {
//                 if (isSignedIn) {
//                     this.refreshEvents();
//                 } else {
//                     this.events = [];
//                 }
//             }
//         );
//     }

//     ngOnDestroy() {
//         if (this.authSubscription) {
//             this.authSubscription.unsubscribe();
//         }
//     }

//     async addBreak() {
//         if (!this.isFormValid()) {
//             return;
//         }

//         this.isLoading = true;
//         const startDateTime = this.combineDateTime(this.breakDate, this.startTime);
//         const endDateTime = this.combineDateTime(this.breakDate, this.endTime);

//         try {
//             await this.googleCalendarService.addBreak(startDateTime, endDateTime, this.description);
//             this.snackBar.open('Przerwa została dodana do kalendarza', 'OK', { duration: 3000 });
//             await this.refreshEvents();
//             this.resetForm();
//         } catch (error) {
//             console.error('Error adding break:', error);
//             this.snackBar.open('Wystąpił błąd podczas dodawania przerwy', 'OK', { duration: 3000 });
//         } finally {
//             this.isLoading = false;
//         }
//     }

//     async refreshEvents() {
//         this.isLoading = true;
//         try {
//             const now = new Date();
//             const thirtyDaysFromNow = new Date();
//             thirtyDaysFromNow.setDate(now.getDate() + 30);

//             this.events = await this.googleCalendarService.getEvents(now, thirtyDaysFromNow);
//         } catch (error) {
//             console.error('Error fetching events:', error);
//             this.snackBar.open('Nie udało się pobrać wydarzeń z kalendarza', 'OK', { duration: 3000 });
//             this.events = [];
//         } finally {
//             this.isLoading = false;
//         }
//     }

//     private combineDateTime(date: Date, time: string): Date {
//         const [hours, minutes] = time.split(':');
//         const combined = new Date(date);
//         combined.setHours(parseInt(hours), parseInt(minutes), 0);
//         return combined;
//     }

//     private resetForm() {
//         this.startTime = '';
//         this.endTime = '';
//         this.description = '';
//     }

//     isFormValid(): boolean {
//         return !!(this.breakDate && this.startTime && this.endTime && this.description);
//     }

//     formatDate(dateString: string): string {
//         const date = new Date(dateString);
//         return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
//     }
// } 