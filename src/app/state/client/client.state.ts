import { Injectable } from "@angular/core";
import {State, Action, StateContext} from "@ngxs/store";
import { tap } from "rxjs";
import { Client } from "../../shared/Model/ClientModel/client-model";
import { ChangeClientData, GetAllClients, SelectClientAboniment, MarkGroupTrainingAsCompleted, UpdateIndividualTrainingStatus, SetSearchFilter, SetStatusFilter, UpdatePagination } from "./client.actions";
import { ApiService } from "../../shared/services/api.service";
import { WebSocketMessageReceived } from "../websocket/websocket.actions";

export interface ClientModel {
    clients: Client[];
    filters: {
        search: string;
        status: {
          active: boolean;
          expired: boolean;
          expiringSoon: boolean;
        }
      };
      pagination: {
        pageSize: number;
        currentPage: number;
      };
}

export interface AttendanceHistory {
    date: Date,
    time: string,
}

@State<ClientModel>({
    name: 'client',
    defaults: {
        clients: [],
        filters: {
          search: '',
          status: {
            active: false,
            expired: false,
            expiringSoon: false
          }
        },
        pagination: {
          pageSize: 10,
          currentPage: 0
        }
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
                const state = ctx.getState();
                ctx.setState({
                    ...state,
                    clients: response
                })
            })
        );
    }

    @Action(ChangeClientData)
    changeClientData(ctx: StateContext<ClientModel>, action: ChangeClientData) {
        const state = ctx.getState();

        return this.apiService.updateClient(action.clientData).pipe(
            tap((updateClientData: Client) => {
                const updatedClientList = state.clients.map(client =>
                    client._id === updateClientData._id ? updateClientData : client
                );

                ctx.patchState({
                    ...state,
                    clients: updatedClientList
                });
            })
        );
    }

    @Action(SelectClientAboniment)
    selectClientAboniment(ctx: StateContext<ClientModel>, action: SelectClientAboniment) {
        const state = ctx.getState();

        return this.apiService.updateClientAboniment(action._id, action.aboniment).pipe(
            tap((updateClientData: Client) => {
                const updatedClientList = state.clients.map(client =>
                    client._id === updateClientData._id ? updateClientData : client
                );

                ctx.patchState({
                    ...state,
                    clients: updatedClientList
                });

            })
        )
    }

    @Action(WebSocketMessageReceived)
    handleWebSocketMessage(ctx: StateContext<ClientModel>, action: WebSocketMessageReceived) {
        const state = ctx.getState();
        const updatedClient = action.payload;

        const updatedClientList = state.clients.map(client =>
            client._id === updatedClient._id ? updatedClient : client
        );

        ctx.patchState({
            ...state,
            clients: updatedClientList
        });
    }

    @Action(MarkGroupTrainingAsCompleted)
    markGroupTrainingAsCompleted(ctx: StateContext<ClientModel>, action: MarkGroupTrainingAsCompleted) {
        const state = ctx.getState();
        return this.apiService.updateGroupTraining(action._id).pipe(
            tap((updateClientData: Client) => {
                const updatedClientList = state.clients.map(client => 
                    client._id === updateClientData._id ? updateClientData : client
                );
                ctx.patchState({
                    ...state,
                    clients: updatedClientList
                });
            })
        )
    }

    @Action(UpdateIndividualTrainingStatus)
    updateIndividualTrainingStatus(ctx: StateContext<ClientModel>, action: UpdateIndividualTrainingStatus) {
        const state = ctx.getState();
        return this.apiService.updateIndividualTraining(action._id, action.sessionId, action.status).pipe(
            tap((updateClientData: Client) => {
                const updatedClientList = state.clients.map(client => 
                    client._id === updateClientData._id ? updateClientData : client
                );
                ctx.patchState({
                    ...state,
                    clients: updatedClientList
                });
            })
        )
    }

    @Action(SetSearchFilter)
    setSearchFilter(ctx: StateContext<ClientModel>, { search }: SetSearchFilter) {
        ctx.patchState({
            filters: { ...ctx.getState().filters, search }
        });
    }

    @Action(SetStatusFilter)
    setStatusFilter(ctx: StateContext<ClientModel>, { status }: SetStatusFilter) {
        ctx.patchState({
            filters: { ...ctx.getState().filters, status }
        });
    }

    @Action(UpdatePagination)
    updatePagination(ctx: StateContext<ClientModel>, { config }: UpdatePagination) {
        ctx.patchState({
        pagination: config
        });
    }
}