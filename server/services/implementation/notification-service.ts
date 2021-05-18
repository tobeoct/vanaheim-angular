
import { Device } from "@models/device";
import { BaseStatus } from "@models/helpers/enums/status";
import { PushNotification } from "@models/pushnotification";
import { Subscription } from "@models/subscription";
import { IBaseRepository } from "@repository/interface/Ibase-repository";
import { IDeviceRepository } from "@repository/interface/Idevice-repository";
import { IPushNotificationRepository } from "@repository/interface/Ipushnotification-repository";
import { ISubscriptionRepository } from "@repository/interface/Isubscription-repository";
import { INotificationService } from "@services/interfaces/Inotification-service";
import { IUserService } from "@services/interfaces/Iuser-service";
import { WebNotData, WebNotification } from "@models/webnotification";
import { BaseService } from "./base-service";

 class NotificationService extends BaseService<any> implements INotificationService{
 constructor(private webPush:any,private _userService:IUserService,private _deviceRepository:IDeviceRepository, private _subscriptionRepository:ISubscriptionRepository,private _pushNotificationRepository:IPushNotificationRepository,_baseRepository:IBaseRepository<any>){
     super(_baseRepository)
     this.convertToModel = this.convertToPushNotification;
 }
 convertToPushNotification= (modelInDb:any) => {
    return new Promise<PushNotification>(async (resolve, reject) =>{
    let notification:any;
    if(modelInDb && Object.keys(modelInDb).length>0){
      notification = new PushNotification();
      notification = modelInDb.dataValues as PushNotification;
      const subscription = await this._subscriptionRepository.getById(notification.subscriptionID);
        if(subscription && Object.keys(subscription).length>0){
        notification.subscription = new Subscription();
        notification.subscription = subscription.dataValues as Subscription;
        }
      }
           resolve(notification);
          });
  }
  convertToSubscription= (modelInDb:any) => {
    return new Promise<Subscription>(async (resolve, reject) =>{
    let subscription:any;
    if(modelInDb && Object.keys(modelInDb).length>0){
      subscription = new Subscription();
      subscription = modelInDb.dataValues as Subscription;
      const device = await this._deviceRepository.getById(subscription.deviceID);
        if(device && Object.keys(device).length>0){
        subscription.device = new Device();
        subscription.device = device.dataValues as Device;
        }
      }
           resolve(subscription);
          });
  }
  convertToDevice= (modelInDb:any) => {
    return new Promise<Device>(async (resolve, reject) =>{
    let device:any;
    if(modelInDb && Object.keys(modelInDb).length>0){
      device = new Device();
      device = modelInDb.dataValues as Device;
      
      }
           resolve(device);
          });
  }
     getPushNotifications= (subscriptionID: number)  => {
        return new Promise<PushNotification[]>(async (resolve, reject) => {
          let notifications = await this._pushNotificationRepository.getBySubscriptionID(subscriptionID);
          if(notifications.length>0){
          notifications.map(async notification=> await this.convertToModel(notification));
          }
          resolve(notifications);
        });
    }
    private sendToDevice=(payload:any)=>{
       
        return new Promise<PushNotification>(async (resolve, reject) => {
            let {device,notification}= payload;
            const sub = await this.convertToSubscription(await this._subscriptionRepository.getByDeviceID(device.id))
            if(!sub) {reject("Failed to get subscription");}
            else{
            console.log("Notification",notification)
            let pushNot = await this.logPushNotification({notification,subscription:sub});
           await this.sendNotification({notification,token:JSON.parse(sub.token),pushNotification:pushNot});
        resolve(pushNot);
            }

    });
    }
    sendNotificationToMany= async (payload:any)=>{
        console.log("Send notification to Many");
        const {customerIds,notification,type} = payload;
        return new Promise<PushNotification[]>(async (resolve, reject) => {
            try{
        let devices:any[]=[];
        let subscriptions:Subscription[]=[];
        let pushNots:PushNotification[]=[];
        if(type=="All"){
            let devicesInDb = await this._deviceRepository.getAll();
            
            devicesInDb.forEach(async device=>{
               const d=  await this.convertToDevice(device);
               pushNots.push(await this.sendToDevice({device:d,notification}))
            });
        }else{
            customerIds.forEach(async(id:number)=>{
               const device= await this.convertToDevice(await this._deviceRepository.getByCustomerID(id));
               pushNots.push(await this.sendToDevice({device,notification}))
            })
        }

resolve(pushNots);
    }catch(err){
        reject(err)
    }
    });

    }

     sendNotification= (payload: any)  => {
        const {userID,notification,browserID,token,pushNotification} = payload;
        const request = JSON.stringify({notification});
        return new Promise<any>(async (resolve, reject) => {
        console.log(`Subscription received`);
        let pushNot = new PushNotification();
        if(pushNotification) pushNot = pushNotification;
        try{

            if(!token){
        let user = await this._userService.convertToModel(await this._userService.getById(userID));
        let device = await this.convertToDevice(await this._deviceRepository.getByBrowser(browserID,user.customer?.id));
            
        const subscription = await this.convertToSubscription(await this._subscriptionRepository.getByDeviceID(device.id));
        pushNot = await this.logPushNotification({notification,subscription});
          
      const response = await this.webPush.sendNotification(JSON.parse(subscription.token), request);
      pushNot.isSent =true;
       await this.updatePushNotification(pushNot);
            resolve(response);
            }else{

                const response = await this.webPush.sendNotification(token, request);
                pushNot.isSent = true;
                await this.updatePushNotification(pushNot);
                resolve(response);
            }
        }catch(err){
            await this.updatePushNotification(pushNot);
            console.log(err);
            reject(err);
        }
        });
    }
     registerDevice=(payload: any)  => {
         const {browserID,customerID} = payload;
        return new Promise<Device>(async (resolve, reject) => {
            let device = await this.convertToDevice(await this._deviceRepository.getByBrowser(browserID,customerID));
            if(device){resolve(device);return;}
            device = new Device();
            device.customerID = customerID;
            device.browserID = browserID;
            device.createdAt = new Date();
            device = await this._deviceRepository.create(device);
            resolve(device);
        });
    }
     subscribe= (payload: any) => {
         const {browserID,token,userID} = payload;
        return new Promise<Subscription>(async (resolve, reject) => {
            let user = await this._userService.convertToModel(await this._userService.getById(userID));
            console.log("UserID",userID)
           const device =await this.registerDevice({browserID,customerID:user.customer.id})
           if(device && Object.keys(device).length>0){
            let subscription =await this.convertToSubscription(await this._subscriptionRepository.getByDeviceID(device.id));
            let subscriptionInDb:any;
            if(!subscription){
                subscription = new Subscription();
                subscription.token = JSON.stringify(token);
                subscription.status = BaseStatus.Active;
                subscription.isExpired = false;
                subscription.deviceID = device.id;
                subscription.createdAt = new Date();
                subscriptionInDb = await this._subscriptionRepository.create(subscription);
                let notification:WebNotification = new WebNotification();
                notification.title = "Welcome to Vanaheim";
                notification.body = "Thanks for subscribing to our notifications. We would be sure to keep you posted";
                notification.vibrate = [100, 50, 100]
                notification.icon= 'https://www.shareicon.net/data/256x256/2015/10/02/110808_blog_512x512.png';
                notification.data = new WebNotData();
                notification.data.url = "http://localhost:4200/my/dashboard";
                if(subscriptionInDb && Object.keys(subscriptionInDb).length>0){
                    console.log("Sending Notification for First Timer")
                    let pushNotification = await this.logPushNotification({notification,subscription});
                    await this.sendNotification({userID,notification,token,pushNotification})
                }
            }
            else{
                subscription.token = JSON.stringify(token);
                subscription.updatedAt = new Date();
                subscriptionInDb = await this._subscriptionRepository.update(subscription);
            }


            if(subscriptionInDb && Object.keys(subscriptionInDb).length>0){
                resolve(subscriptionInDb);
            }else{
                reject("Subscription Failed")
            }
            
           }else{
               reject("Device Registration Failed")
           }
        });
    }

    logPushNotification= async(payload:any)=>{
        let {notification,subscription} = payload;
        var pushNot = new PushNotification();
        pushNot.body = notification.body;
        pushNot.photo = notification.photo;
        pushNot.url = notification.data.url;
        pushNot.title = notification.title;
        pushNot.subscriptionID = subscription?.id;
        pushNot.createdAt = new Date();
        pushNot.isSent = false;
        console.log("Logging push notification")
       return await this.convertToPushNotification(await this._pushNotificationRepository.create(pushNot));
    }

    updatePushNotification=async(pushNot:PushNotification)=>{
        pushNot.createdAt = new Date();
        await this._pushNotificationRepository.update(pushNot);
    }


}

export default NotificationService;