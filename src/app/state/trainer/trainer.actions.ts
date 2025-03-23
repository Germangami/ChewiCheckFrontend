import { WorkSchedule, BookingStatus } from "../../shared/Model/TrainerModel/trainer-model";

export class GetTrainer {
    static readonly type = '[Trainer] Get Trainer';
    constructor(public tgId: number) {}
}

export class UpdateTrainerSchedule {
    static readonly type = '[Trainer] Update Schedule';
    constructor(public trainerId: number, public workSchedule: WorkSchedule) {}
}

export class AddBreak {
    static readonly type = '[Trainer] Add Break';
    constructor(public trainerId: number, public workSchedule: WorkSchedule) {}
}

export class RemoveBreak {
    static readonly type = '[Trainer] Remove Break';
    constructor(public trainerId: number, public workSchedule: WorkSchedule) {}
}

export class GetAvailableSlots {
    static readonly type = '[Trainer] Get Available Slots';
    constructor(public trainerId: number, public date: string) {}
}

export class BookTimeSlot {
    static readonly type = '[Trainer] Book Time Slot';
    constructor(
        public trainerId: number, 
        public client: {
            tgId: number, 
            first_name: string, 
            nickname?: string
        }, 
        public date: string, 
        public time: string
    ) {}
}

export class CancelBooking {
    static readonly type = '[Trainer] Cancel Booking';
    constructor(
        public trainerId: number, 
        public client: {
            tgId: number, 
            first_name: string, 
            nickname?: string
        }, 
        public date: string, 
        public time: string
    ) {}
}

export class UpdateBookingStatus {
    static readonly type = '[Trainer] Update Booking Status';
    constructor(
        public trainerId: number,
        public clientTgId: number,
        public date: string,
        public time: string,
        public status: BookingStatus
    ) {}
} 