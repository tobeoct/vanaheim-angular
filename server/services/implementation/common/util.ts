
export default class UtilService{
 ipChecks:any = {};
 retryCount:number =0;
  createResponse=():any=> {
   return {isSuccessful:false, ResponseCode:"06",ResponseDescription:"Processing",Data:null};
  }
   currencyFormatter=(value:any)=>{
  return Intl.NumberFormat('yo-NG', {style: 'currency', currency: 'NGN'})
.format(value)
}
 randPassword=(letters:number, numbers:number, either:number) =>{
  var chars = [
   "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", // letters
   "0123456789", // numbers
   "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" // either
  ];

  return [letters, numbers, either].map(function(len, i) {
    return Array(len).fill(chars[i]).map(function(x) {
      return x[Math.floor(Math.random() * x.length)];
    }).join('');
  }).concat().join('').split('').sort(function(){
    return 0.5-Math.random();
  }).join('')
}
autogenerate=({prefix}:any)=>{
 return `${prefix}_`+Math.floor(Math.random() * 10000);
}
  titleCase=(str:any)=> {
    try{
    if(this.hasValue(str)){
    if(str.includes("NGN")) return str;
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
    }
    return str.join(' ');
  }
  return str;
    }catch(err){
      console.log(err);
      return str;
    }
  }
    myEscape=(value:any)=>{
    var tagsToReplace:any = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
    };
    value = value.replace(/[&<>]/g, function(tag:any) {
        return tagsToReplace[tag] || tag;
    });
    return value;
  }

  
  spamChecker=(ip:any,controller:any)=>{
    try{
      if(!this.hasValue(ip)||!this.hasValue(controller)) return false;
    if(this.hasValue(this.ipChecks[controller])){
      let value = this.ipChecks[controller][ip];
      if(this.hasValue(value)){
      if(parseInt(value.count)>=this.retryCount && (value.datetime.getHours())==new Date().getHours()){
        this.ipChecks[controller][ip].count +=1;
        this.ipChecks[controller][ip].datetime = new Date();
        return false;
      }else{
        this.ipChecks[controller][ip].count +=1;
        this.ipChecks[controller][ip].datetime = new Date();
      }
    }else{
      this.ipChecks[controller][ip]={count:1,datetime:new Date()};
    }
    }else{
      this.ipChecks[controller]={};
      this.ipChecks[controller][ip]={count:1,datetime:new Date()}
    }
    console.log("SPAM CHECKER:" +JSON.stringify(this.ipChecks));
    return true;
  }catch(err){
    console.log("SPAM CHECKER: ERROR -" +err);
  } return false;
  }
    hasValue=(obj:any)=>{
    if(obj!==""&&obj!==null && obj!==undefined && obj!=="undefined" && obj!={}) return true;
    return false;
  }

    validateRequest=(request:any,formType:any)=>{
    let payload = request.payload;
    console.log(payload)
    return JSON.parse(payload);
  }
    verifyRequest=(req:any,controller:any)=>{
    if(!this.hasValue(req.body)) return false;
    if(!this.hasValue(req.ip)) return false;
    if(controller==="sendapplication"){
      if(!this.hasValue(req.body.email)) return false;
     
    }
    return true;
  }

   validateResponse=(response:any)=> {
    if (response.status!==200) {
      throw Error(response.statusText);
    }
    return response;
  }
  
   readResponseAsJSON=(response:any)=> {
    return response.data;
  }//https://cors-anywhere.herokuapp.com/
  
}
  // module.exports={
  //   createResponse,verifyRequest,validateRequest,hasValue,spamChecker,myEscape,titleCase,currencyFormatter,readResponseAsJSON,validateResponse
  // }

