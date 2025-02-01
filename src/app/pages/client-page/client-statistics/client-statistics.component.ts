import { Component } from "@angular/core";
import { BaseChartDirective } from 'ng2-charts';
import { MatCardModule } from '@angular/material/card';
import { ChartConfiguration } from 'chart.js';

@Component({
    selector: 'app-client-statistics',
    standalone: true,
    imports: [
        BaseChartDirective,
        MatCardModule
    ],
    template: `
        <mat-card>
            <mat-card-title>Статистика тренировок</mat-card-title>
            <mat-card-content>
                <canvas baseChart
                    [data]="barChartData"
                    [options]="barChartOptions"
                    [type]="'bar'">
                </canvas>
            </mat-card-content>
        </mat-card>
    `
})
export class ClientStatisticsComponent {
    public barChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    public barChartData: ChartConfiguration['data'] = {
        labels: ['Пн', 'Ср', 'Пт'],
        datasets: [
            {
                data: [8, 7, 6],
                label: 'Посещено тренировок',
                backgroundColor: '#4CAF50'
            },
            {
                data: [2, 3, 4],
                label: 'Пропущено тренировок',
                backgroundColor: '#F44336'
            }
        ]
    };
} 