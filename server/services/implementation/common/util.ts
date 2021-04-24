

let ipChecks:any = {};
const retryCount:number =0;
 const createResponse=():any=> {
   return {isSuccessful:false, ResponseCode:"06",ResponseDescription:"Processing",Data:null};
  }
  const currencyFormatter=(value:any)=>{
  return Intl.NumberFormat('yo-NG', {style: 'currency', currency: 'NGN'})
.format(value)
}

 const titleCase=(str:any)=> {
    try{
    if(hasValue(str)){
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
   const myEscape=(value:any)=>{
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

  
 const spamChecker=(ip:any,controller:any)=>{
    try{
      if(!hasValue(ip)||!hasValue(controller)) return false;
    if(hasValue(ipChecks[controller])){
      let value = ipChecks[controller][ip];
      if(hasValue(value)){
      if(parseInt(value.count)>=retryCount && (value.datetime.getHours())==new Date().getHours()){
        ipChecks[controller][ip].count +=1;
        ipChecks[controller][ip].datetime = new Date();
        return false;
      }else{
        ipChecks[controller][ip].count +=1;
        ipChecks[controller][ip].datetime = new Date();
      }
    }else{
      ipChecks[controller][ip]={count:1,datetime:new Date()};
    }
    }else{
      ipChecks[controller]={};
      ipChecks[controller][ip]={count:1,datetime:new Date()}
    }
    console.log("SPAM CHECKER:" +JSON.stringify(ipChecks));
    return true;
  }catch(err){
    console.log("SPAM CHECKER: ERROR -" +err);
  } return false;
  }
   const hasValue=(obj:any)=>{
    if(obj!==""&&obj!==null && obj!==undefined && obj!=="undefined" && obj!={}) return true;
    return false;
  }

   const validateRequest=(request:any,formType:any)=>{
    let payload = request.payload;
    console.log(payload)
    return JSON.parse(payload);
  }
   const verifyRequest=(req:any,controller:any)=>{
    if(!hasValue(req.body)) return false;
    if(!hasValue(req.ip)) return false;
    if(controller==="sendapplication"){
      if(!hasValue(req.body.email)) return false;
     
    }
    return true;
  }

  const validateResponse=(response:any)=> {
    if (response.status!==200) {
      throw Error(response.statusText);
    }
    return response;
  }
  
  const readResponseAsJSON=(response:any)=> {
    return response.data;
  }//https://cors-anywhere.herokuapp.com/
  

  module.exports={
    createResponse,verifyRequest,validateRequest,hasValue,spamChecker,myEscape,titleCase,currencyFormatter,readResponseAsJSON,validateResponse
  }