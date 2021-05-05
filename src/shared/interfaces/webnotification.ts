export class WebNotification{
    
        title:string;
        body:string;
        icon:string
        vibrate: number[];
        data: WebNotData;
      
}

export class WebNotData{
    url:string;
}
