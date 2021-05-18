
export class Address{
    street:string;
    city:string;
    state:string;
    toString(){
        return this.street+', '+ this.city + ', ' + this.state;
    }
}