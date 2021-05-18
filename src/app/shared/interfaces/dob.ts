
export class DOB{
    day:number;
    month:string;
    year:number;
    toString(){
        return this.day+' '+ this.month + ', ' + this.year;
    }
}
