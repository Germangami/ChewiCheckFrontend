export interface Client {
    tgId?: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    nickname?: string,
    role?: Role,
    _id: string 
}

export enum Role {
    CLIENT = 'Client',
    COACH = 'Coach'
}