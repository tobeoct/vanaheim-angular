import { Client } from "@entities/client";
import { IBaseRepository } from "@repository/interface/Ibase-repository";
import { IClientRepository } from "@repository/interface/Iclient-repository";
import { IClientService } from "@services/interfaces/Iclient-service";
import { BaseService } from "./base-service";

 class ClientService extends BaseService<Client> implements IClientService{
 constructor(private _clientRepository:IClientRepository,_baseRepository:IBaseRepository<Client>){
     super(_baseRepository)
 }
  getClientDetails = (clientApiKey:any) => {
    return new Promise<Client>((resolve, reject) => {
        let client = new Client();
        client.apiKey = clientApiKey;
        resolve(client)
    });
}
}

export default ClientService;