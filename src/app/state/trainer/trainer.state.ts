import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { Trainer, WorkSchedule, AvailableSlot } from '../../shared/Model/TrainerModel/trainer-model';
import { tap } from 'rxjs/operators';
import { ApiService } from '../../shared/services/api.service';
import { BookTimeSlot, CancelBooking, GetAvailableSlots, GetTrainer, UpdateTrainerSchedule } from './trainer.actions';

export interface TrainerStateModel extends Trainer {
  availableSlots: AvailableSlot[];
  loading: boolean;
  error: string | null;
}

@State<TrainerStateModel>({
  name: 'trainer',
  defaults: {
    _id: '',
    tgId: 0,
    first_name: '',
    last_name: '',
    username: '',
    role: 'trainer',
    isActive: false,
    workSchedule: {
      workDays: [],
      workHours: {
        start: '',
        end: ''
      }
    },
    bookedSlots: [],
    availableSlots: [],
    loading: false,
    error: null
  }
})
@Injectable()
export class TrainerState {
  constructor(private apiService: ApiService) {}

  @Action(GetTrainer)
  getTrainer(ctx: StateContext<TrainerStateModel>, action: GetTrainer) {
    ctx.patchState({ loading: true });
    return this.apiService.getTrainerById(action.tgId).pipe(
      tap({
        next: (trainer) => {
          ctx.patchState({
            ...trainer,
            loading: false,
            error: null
          });
        },
        error: (error) => {
          ctx.patchState({
            loading: false,
            error: error.message
          });
        }
      })
    );
  }

  @Action(UpdateTrainerSchedule)
  updateSchedule(ctx: StateContext<TrainerStateModel>, action: UpdateTrainerSchedule) {
    return this.apiService.updateTrainerSchedule(action.trainerId, action.workSchedule).pipe(
      tap({
        next: (trainer) => {
          ctx.patchState({
            ...trainer,
            error: null
          });
        },
        error: (error) => {
          ctx.patchState({
            error: error.message
          });
        }
      })
    );
  }

  @Action(GetAvailableSlots)
  getAvailableSlots(ctx: StateContext<TrainerStateModel>, action: GetAvailableSlots) {
    return this.apiService.getAvailableSlots(action.trainerId, action.date).pipe(
      tap({
        next: (slots) => {
          ctx.patchState({
            availableSlots: slots,
            error: null
          });
        },
        error: (error) => {
          ctx.patchState({
            error: error.message
          });
        }
      })
    );
  }

  @Action(BookTimeSlot)
  bookTimeSlot(ctx: StateContext<TrainerStateModel>, action: BookTimeSlot) {
    console.log(action, 'action12312312');
    return this.apiService.bookTimeSlot(
      action.trainerId, 
      action.client, 
      action.date, 
      action.time
    ).pipe(
      tap({
        next: (trainer) => {
          ctx.patchState({
            ...trainer,
            error: null
          });
        },
        error: (error) => {
          ctx.patchState({
            error: error.message
          });
        }
      })
    );
  }

  @Action(CancelBooking)
  cancelBooking(ctx: StateContext<TrainerStateModel>, action: CancelBooking) {
    return this.apiService.cancelBooking(
      action.trainerId, 
      action.client, 
      action.date, 
      action.time
    ).pipe(
      tap({
        next: (trainer) => {
          ctx.patchState({
            ...trainer,
            error: null
          });
        },
        error: (error) => {
          ctx.patchState({
            error: error.message
          });
        }
      })
    );
  }
} 