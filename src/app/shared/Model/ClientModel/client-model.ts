export interface Client {
    _id?: string;  // MongoDB ID
    tgId?: number;
    trainerId?: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    nickname?: string;
    role?: string;
    note?: string;
    clientType?: ClientType;
    groupTraining?: GroupTraining;
    individualTraining?: IndividualTraining;
    lastTrainingDate?: string;
}

export interface GroupTraining {
    aboniment?: number;
    startDate?: string;
    endDate?: string;
    totalTrainings?: number;
    remainingTrainings?: number;
    isActive?: boolean;
    attendanceHistory?: AttendanceRecord[];
}

export interface IndividualTraining {
    scheduledSessions?: ScheduledSession[];
    pricePerSession?: number;
    preferredDays?: string[];
    preferredTime?: string;
}

export interface ScheduledSession {
    date?: string;
    time?: string;
    status?: AttendanceStatus;  // planned | completed | missed
}

export enum Role {
    CLIENT = 'Client',
    COACH = 'Coach'
}

export enum ClientType {
    GROUP = 'group',
    INDIVIDUAL = 'individual'
}

// Общий интерфейс для записи посещений
export interface AttendanceRecord {
    date?: string;
    time?: string;
    status?: AttendanceStatus;
}

export enum AttendanceStatus {
    COMPLETED = 'completed',
    MISSED = 'missed',
    PLANNED = 'planned'  // для индивидуальных тренировок
}