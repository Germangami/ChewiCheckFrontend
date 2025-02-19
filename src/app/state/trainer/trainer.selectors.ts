import { Selector } from '@ngxs/store';
import { TrainerState, TrainerStateModel } from './trainer.state';

export class TrainerSelectors {
    @Selector([TrainerState])
    static getTrainer(state: TrainerStateModel) {
        const { loading, error, availableSlots, ...trainer } = state;
        return trainer;
    }

    @Selector([TrainerState])
    static getWorkSchedule(state: TrainerStateModel) {
        return state.workSchedule;
    }

    @Selector([TrainerState])
    static getAvailableSlots(state: TrainerStateModel) {
        return state.availableSlots;
    }

    @Selector([TrainerState])
    static getLoading(state: TrainerStateModel) {
        return state.loading;
    }

    @Selector([TrainerState])
    static getError(state: TrainerStateModel) {
        return state.error;
    }
} 