import { Selector } from "@ngxs/store";
import { ClientModel, ClientState } from "./client.state";
import { Client } from "../../shared/Model/ClientModel/client-model";


export class ClientSelectors {

    @Selector([ClientState])
    static getUsers(state: ClientModel): Client[] {
        return state.clients || []; // Гарантируем возврат массива
    }


    @Selector([ClientState])
    static getPaginationConfig(state: ClientModel) {
        return state.pagination || { pageSize: 10, currentPage: 0 };
    }

    @Selector([ClientState])
    static getFilteredClients(state: ClientModel) {
        const search = state.filters?.search?.toLowerCase() || '';
        const status = state.filters?.status || { 
            active: false, 
            expired: false, 
            expiringSoon: false 
        };

        return (state.clients || []).filter(client => {
            const firstName = client.first_name?.toLowerCase() || '';
            const nickname = client.nickname?.toLowerCase() || '';
            const matchesSearch = firstName.includes(search) || nickname.includes(search);
            
            return matchesSearch && this.checkStatusMatch(client, status);
        });
    }

    private static checkStatusMatch(client: Client, status: ClientModel['filters']['status']) {
        if (!status.active && !status.expired && !status.expiringSoon) return true;

        return (
            (status.active && client.groupTraining?.isActive) ||
            (status.expired && !client.groupTraining?.isActive) ||
            (status.expiringSoon && this.isExpiringSoon(client))
        );
    }

    private static isExpiringSoon(client: Client): boolean {
        const endDate = client.groupTraining?.endDate;
        if (!endDate) return false;

        const diff = new Date(endDate).getTime() - Date.now();
        return diff > 0 && diff <= 3 * 86400000; // 3 days
    }

}