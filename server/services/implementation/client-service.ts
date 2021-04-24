import { Client } from "@models/client";
import { IClientService } from "@services/interfaces/Iclient-service";
import { BaseService } from "./base-service";

 class ClientService extends BaseService<Client> implements IClientService{
 
  getClientDetails = (clientApiKey:any) => {
    return new Promise<Client>((resolve, reject) => {
        // db.collection('clients').find({ 'client_api_key': clientApiKey }).toArray((err, docs) => {
        //     if(docs && docs.length>0){
        //         resolve(docs[0]);
        //     }else{
        //         reject(false);
        //     }
        // });
        let client = new Client();
        client.apiKey = clientApiKey;
        resolve(client)
    });
}
}

export default ClientService;