export class WebNotification{
    
        title:string;
        body:string;
        icon:string ="https://i.tracxn.com/logo/company/Capture_6b9f9292-b7c5-405a-93ff-3081c395624c.PNG?height=120&width=120";
        vibrate: number[]=  [100, 50, 100];
        data: WebNotificationData;
      
}

export class WebNotificationData{
    url:string= "http://localhost:4200/my/dashboard";
}
