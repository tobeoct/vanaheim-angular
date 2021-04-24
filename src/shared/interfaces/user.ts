import { UserCategory } from "@enums/usercategory";

export class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    category:UserCategory;
    authdata?: string;
}
