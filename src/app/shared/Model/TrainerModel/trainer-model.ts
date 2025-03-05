export interface Trainer {
    _id?: string;  // MongoDB ID
    tgId: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    role: string;
    isActive: boolean;
    workSchedule: WorkSchedule;
    clients?: string[];  // Client IDs
    bookedSlots?: BookedSlot[];
}

export interface WorkSchedule {
    workDays: WeekDay[];
    workHours: {
        start: string;  // format "HH:mm"
        end: string;    // format "HH:mm"
    };
    breaks?: {
        weekDay: WeekDay;
        time: string;  // format "HH:mm"
        duration: number;  // in minutes
        description?: string;  // example: "Lunch" or "Break"
    }[];
    unavailableSlots?: {
        date: string;  // format "YYYY-MM-DD"
        time: string;  // format "HH:mm"
        duration: number;  // in minutes
        description?: string;
    }[];
    exceptions?: {
        date: string;
        available: boolean;
        reason?: string;
    }[];
}

export interface BookedSlot {
    date: string;      // format "YYYY-MM-DD"
    time: string;      // format "HH:mm"
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
    PLANNED = 'planned',
    COMPLETED = 'completed',
    MISSED = 'missed'
}

// Helper type for available slots
export interface AvailableSlot {
    date: string;    // format "YYYY-MM-DD"
    time: string;    // format "HH:mm"
    isAvailable: boolean;
    unavailableReason?: string;  // "break", "day-off", "booked", etc.
} 