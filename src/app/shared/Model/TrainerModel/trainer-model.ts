export interface Trainer {
    _id?: string;  // MongoDB ID
    tgId: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    role: string;
    isActive: boolean;
    workSchedule: WorkSchedule;
    clients?: string[];  // IDs клиентов
    bookedSlots?: BookedSlot[];
}

export interface WorkSchedule {
    workDays: WeekDay[];
    workHours: {
        start: string;  // формат "HH:mm"
        end: string;    // формат "HH:mm"
    };
    exceptions?: {
        date: string;
        available: boolean;
    }[];
}

export interface BookedSlot {
    date: string;      // формат "YYYY-MM-DD"
    time: string;      // формат "HH:mm"
    startTime: string;
    client: {
        tgId: number, 
        first_name: string, 
        nickname?: string
    };
    status: BookingStatus;
}

export enum WeekDay {
    MONDAY = 'Monday',
    TUESDAY = 'Tuesday',
    WEDNESDAY = 'Wednesday',
    THURSDAY = 'Thursday',
    FRIDAY = 'Friday',
    SATURDAY = 'Saturday',
    SUNDAY = 'Sunday'
}

export enum BookingStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed'
}

// Вспомогательный тип для доступных слотов
export interface AvailableSlot {
    date: string;    // формат "YYYY-MM-DD"
    time: string;    // формат "HH:mm"
    isAvailable: boolean;
} 