import { Client } from "../../shared/Model/ClientModel/client-model";

export class GetAllClients {
    static readonly type = '[Client] get all clients';
}

export class ChangeClientData {
    static readonly type = '[Client] change client data';

    constructor(public clientData: Client) {

    }
}

export class MarkClientTrainingAsCompleted {
    static readonly type = '[Client] mark client trainings as complited';

    constructor(public _id: string) {

    }
}

export class SelectClientAboniment {
    static readonly type = '[Client] select client aboniment data';

    constructor(public aboniment: number, public _id: string) {

    }
}