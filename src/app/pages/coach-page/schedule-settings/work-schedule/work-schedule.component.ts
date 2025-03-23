import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { Trainer, WeekDay, WorkSchedule } from '../../../../shared/Model/TrainerModel/trainer-model';
import { UpdateTrainerSchedule, AddBreak, RemoveBreak } from '../../../../state/trainer/trainer.actions';

@Component({
  selector: 'app-work-schedule',
  templateUrl: './work-schedule.component.html',
  styleUrl: './work-schedule.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatExpansionModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkScheduleComponent {
  @Input() currentTrainer: Trainer | null = null;
  
  weekDays = Object.values(WeekDay);
  workHoursForm: FormGroup;
  breakForm: FormGroup;
  breaks: any[] = [];

  constructor(
    private store: Store,
    private fb: FormBuilder,
  ) {
    this.workHoursForm = this.fb.group({
      monday: [false],
      tuesday: [false],
      wednesday: [false],
      thursday: [false],
      friday: [false],
      saturday: [false],
      sunday: [false],
      startTime: ['09:00', Validators.required],
      endTime: ['18:00', Validators.required]
    });

    this.breakForm = this.fb.group({
      weekDay: ['', Validators.required],
      time: ['', Validators.required],
      duration: [60, [Validators.required, Validators.min(15), Validators.max(240)]],
      description: ['']
    });
  }

  ngOnChanges() {
    if (this.currentTrainer?.workSchedule) {
      this.loadTrainerSchedule();
    }
  }

  private loadTrainerSchedule() {
    if (!this.currentTrainer?.workSchedule) return;

    const schedule = this.currentTrainer.workSchedule;
    
    // Загружаем рабочие дни
    this.weekDays.forEach(day => {
      const control = this.workHoursForm.get(day.toLowerCase());
      if (control) {
        control.setValue(schedule.workDays.includes(day));
      }
    });

    // Загружаем рабочие часы
    if (schedule.workHours) {
      this.workHoursForm.patchValue({
        startTime: schedule.workHours.start,
        endTime: schedule.workHours.end
      });
    }

    // Загружаем перерывы
    if (schedule.breaks) {
      this.breaks = [...schedule.breaks];
    }
  }

  addBreak() {
    if (this.breakForm.valid && this.currentTrainer) {
      const newBreak = this.breakForm.value;
      const updatedBreaks = [...this.breaks, newBreak];
      
      const workSchedule: WorkSchedule = {
        ...this.currentTrainer.workSchedule,
        breaks: updatedBreaks
      };

      this.store.dispatch(new AddBreak(
        this.currentTrainer.tgId,
        workSchedule
      ));
      
      this.breaks = updatedBreaks;
      this.breakForm.reset({
        duration: 60
      });
    }
  }

  removeBreak(breakToRemove: any) {
    if (!this.currentTrainer) return;

    const updatedBreaks = this.breaks.filter(b => 
      b.weekDay !== breakToRemove.weekDay || 
      b.time !== breakToRemove.time
    );

    const workSchedule: WorkSchedule = {
      ...this.currentTrainer.workSchedule,
      breaks: updatedBreaks
    };

    this.store.dispatch(new RemoveBreak(
      this.currentTrainer.tgId,
      workSchedule
    ));
    
    this.breaks = updatedBreaks;
  }

  saveWorkSchedule() {
    if (!this.currentTrainer || !this.workHoursForm.valid) return;

    const workDays = this.weekDays.filter(day => 
      this.workHoursForm.get(day.toLowerCase())?.value
    );

    const workSchedule: WorkSchedule = {
      workDays,
      workHours: {
        start: this.workHoursForm.get('startTime')?.value,
        end: this.workHoursForm.get('endTime')?.value
      },
      breaks: this.breaks
    };

    this.store.dispatch(new UpdateTrainerSchedule(
      this.currentTrainer.tgId,
      workSchedule
    ));
  }
} 