export default class Encryption {
    saltRounds:number = 10;
    constructor(private bcrypt:any){

    }

    public generateHash=(value:string)=>{
        
      return new Promise((resolve,reject)=>{  
        try{  
        this.bcrypt.genSalt(this.saltRounds, (err:any, salt:any)=> {
            this.bcrypt.hash(value, salt, (err:any, hash:any) =>{
                // Store hash in your password DB.
                resolve({salt,hash});
            });
        });
    }catch(err){
        reject(err)
    }
    });
}

public compare=(value:string,hash:string)=>{
    return new Promise<boolean>((resolve,reject)=>{  
         
        this.bcrypt.compare(value, hash).then((result:any) =>{
            // result == true
            resolve(result);
        }).catch((err:any)=>{
        reject(err)
    });
    });
}
}