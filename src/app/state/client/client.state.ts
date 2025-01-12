import { Injectable } from "@angular/core";
import {State, Action, StateContext} from "@ngxs/store";
import { tap } from "rxjs";
import { Client } from "../../shared/Model/ClientModel/client-model";
import { ChangeClientData, GetAllClients } from "./client.actions";
import { ApiService } from "../../shared/services/api.service";

export interface ClientModel {
    client: Client[];
}

export interface AttendanceHistory {
    date: Date,
    time: string,
}

@State<ClientModel>({
    name: 'client',
    defaults: {
        client: []
    }
})
@Injectable()
export class ClientState {

    constructor(private apiService: ApiService) {

    }

    @Action(GetAllClients)
    getUsers(ctx: StateContext<ClientModel>) {
        return this.apiService.getClients().pipe(
            tap(response => {
                console.log(response, 'RESP RESP')
                const state = ctx.getState();
                ctx.setState({
                    ...state,
                    client: response
                })
            })
        );
    }

    @Action(ChangeClientData)
    changeClientData(ctx: StateContext<ClientModel>, action: ChangeClientData) {
        const state = ctx.getState();

        return this.apiService.updateClient(action.clientData).pipe(
            tap((updateClientData: Client) => {
                const updatedClientList = state.client.map(client =>
                    client._id === updateClientData._id ? updateClientData : client
                );

                ctx.patchState({
                    ...state,
                    client: updatedClientList
                });

            })
        );
    }
}