import { Client } from "../../shared/Model/ClientModel/client-model";

export class GetAllClients {
    static readonly type = '[Client] get all clients';
}

export class ChangeClientData {
    static readonly type = '[Client] change client data';

    constructor(public clientData: Client) {

    }
}

export class SelectClientAboniment {
    static readonly type = '[Client] select client aboniment data';

    constructor(public aboniment: number, public _id: string) {

    }
}

export class MarkGroupTrainingAsCompleted {
    static readonly type = '[Client] Mark Group Training As Completed';
    constructor(public _id: string) {}
}

export class UpdateIndividualTrainingStatus {
    static readonly type = '[Client] Update Individual Training Status';
    constructor(
        public _id: string,
        public sessionId: string,
        public status: string
    ) {}
}