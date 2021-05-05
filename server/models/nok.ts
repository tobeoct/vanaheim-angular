import { Gender } from "@enums/gender";
import { Relationship } from "@enums/relationship";
import { BaseEntity } from "./base-entity";
import { ContactDetails } from "./contact-details";

export class NOK extends BaseEntity implements ContactDetails{
    phoneNumber: string;
    street: string;
    city: string;
    state: string;
    firstname:string;
    othernames:string;
    address:string;
    email:string;
    dateOfBirth:string;
     gender:Gender;
     relationship:Relationship;
}