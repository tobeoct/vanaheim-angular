
const validateResponse = (response:any) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

const readResponseAsJSON = (response:any) => {
    return response.json();
}

const readResponseAsBlob = (response:any) => {
    return response.blob();
}

const readResponseAsText = (response:any) => {
    return response.text();
}
const IsResponseSuccessful = (response:any) => {
    return response.IsSuccessful;
}
const ResponseMessage = (response:any) => {
    return response.ResponseDescription;
}
const ResponseData = (response:any) => {
    return response.Data;
}

const logError = (error:any) => {
    console.log('Looks like there was a problem:', error);
}
export class APIHelper{
    
get(endpoint:string){
    
}
post(endpoint:string, body:any, headers:any){
    return new Promise((resolve, reject) => {
        let messageHeaders = new Headers({
            'Content-Type': 'application/json'
        })
        if (headers !== undefined) messageHeaders = headers;
        // let url = `${baseUrl}${endpoint}`;
        let url = `/api/${endpoint}`;
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: messageHeaders
        }).then(validateResponse).then((response) => readResponseAsJSON(response)).then(result => {
            resolve(result);
        }).catch((err:any) => {
            reject(err);
            logError(err);
        });
    });
    
}
 
}