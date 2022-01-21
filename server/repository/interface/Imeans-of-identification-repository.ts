import { MeansOfIdentification } from "@models/investment/means-of-identification";
import { IBaseRepository } from "./Ibase-repository";

export interface IMeansOfIdentificationRepository extends IBaseRepository<MeansOfIdentification>{
    getByDocumentID: (documentID:number) => Promise<any>
}