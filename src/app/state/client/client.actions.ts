import { Client } from "../../shared/Model/ClientModel/client-model";

export class GetAllClients {
    static readonly type = '[Client] get all clients';
}

export class ChangeClientData {
    static readonly type = '[Client] change client data';

    constructor(public clientData: Client) {

    }
}