export interface Client {
    tgId?: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    nickname?: string,
    role?: Role,
    note?: string,
    totalTrainings?: number,
    remainingTrainings?: number,
    aboniment: number;
    startDate?: string,
    endDate?: string,
    _id: string
}

export enum Role {
    CLIENT = 'Client',
    COACH = 'Coach'
}