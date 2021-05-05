import NotificationService from "@services/implementation/notification-service";
import { route, POST } from "awilix-express";
@route('/api/notification')
export default class NotificationController {
    constructor(private _notificationService:NotificationService) {

    }
    
    @route('/sendtomultiple')
    @POST()
    sendToMultiple=async(req:any, res:any,next:any) => {
      const {notification} = req.body;
      this._notificationService.sendNotificationToMany({notification,type:"All"}).then(response=>{
        res.statusCode = 200;
        res.data = response;
        next();
      }).catch(err=>{
        res.statusCode = 400;
        res.data = "Notification Failed to send";
        next();
      })
    }
    @route('/send')
    @POST()
    send=async(req:any, res:any,next:any) => {
      const {notification,browserID} = req.body;
      const {userData} = req.session; 
      this._notificationService.sendNotification({notification,userID:userData.id,browserID}).then(response=>{
        res.statusCode = 200;
        res.data = response;
        next();
      }).catch(err=>{
        res.statusCode = 400;
        res.data = "Notification Failed to send";
        next();
      })
    }
    @route('/subscribe')
    @POST()
    subscribe=async(req:any, res:any,next:any) => {
      const {token,browserID} = req.body;
      const {userData} = req.session; 
      if(userData.id==0){res.statusCode =200; res.data = {code:"01", message:"User is not yet registered"};}
      this._notificationService.subscribe({token,userID:userData.id,browserID}).then(response=>{
        res.statusCode = 200;
        res.data = response;
        next();
      }).catch(err=>{
        res.statusCode = 400;
        res.data = "Failed to subscribe";
        next();
      })
    }

}


