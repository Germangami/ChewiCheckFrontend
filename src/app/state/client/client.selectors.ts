import { Selector } from "@ngxs/store";
import { ClientModel, ClientState } from "./client.state";
import { Client } from "../../shared/Model/ClientModel/client-model";


export class ClientSelectors {

    @Selector([ClientState])
    static getUsers(state: ClientModel): Client[] {
        return state.client;
    }
}