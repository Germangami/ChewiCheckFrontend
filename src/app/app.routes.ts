import { Routes } from '@angular/router';
import { CoachPageComponent } from './pages/coach-page/coach-page.component';
import { ClientPageComponent } from './pages/client-page/client-page.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ScheduleSettingsComponent } from './pages/coach-page/schedule-settings/schedule-settings.component';
import { TrainingSchedulerComponent } from './pages/client-page/indiviual-client-view/training-scheduler/training-scheduler.component';

export const routes: Routes = [
    {
        path: '',
        component: DashboardComponent
    },
    {
        path: 'coach',
        component: CoachPageComponent
    },
    {
        path: 'coach/schedule',
        component: ScheduleSettingsComponent
    },
    {
        path: 'client/:id',
        component: ClientPageComponent
    },
    {
        path: 'client/:id/schedule',
        component: TrainingSchedulerComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];
