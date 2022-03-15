import AppConfig from "server/config";
import { Customer } from "@entities/customer";
import { WebNotificationData, WebNotification } from "@models/webnotification";
import { ICustomerRepository } from "@repository/interface/Icustomer-repository";
import EmailService from "@services/implementation/common/email-service";
import { TemplateService } from "@services/implementation/common/template-service";
import NotificationService from "@services/implementation/notification-service";
import { route, POST } from "awilix-express";
import { VanaheimBodyRequest } from "@models/express/request";
import { VanaheimTypedResponse } from "@models/express/response";
@route('/api/notification')
export default class NotificationController {
  constructor(private _notificationService: NotificationService, private _templateService: TemplateService, private _customerRepository: ICustomerRepository, private _emailService: EmailService, private _appConfig: AppConfig, private sanitizer: any) {

  }

  @route('/notifyCustomer')
  @POST()
  notifyCustomer = async (req: VanaheimBodyRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
    let { message, type, customerIDs, code } = req.body;
    let name = "";
    try {
      if (!customerIDs || !message || !type) {
        res.statusCode = 400;
        res.payload = { message: "Please fill all necessary details" };
        next();
        return;
      }
      type = this.sanitizer.escape(type);
      message = this.sanitizer.escape(message);
      // customerIDs = this.sanitizer.escape(customerIDs);
      code = this.sanitizer.escape(code);
      let errorList: string[] = [];
      customerIDs.forEach(async (customerID: number) => {
        try {
          let customer = await this._customerRepository.getById(customerID) as Customer;
          name = customer.firstName + " " + customer.lastName;
          let notification: WebNotification = new WebNotification();
          notification.title = "Vanir Capital" + type?.toString() ?? "Notification";
          notification.body = message;
          notification.vibrate = [100, 50, 100]
          notification.icon = 'https://i.tracxn.com/logo/company/Capture_6b9f9292-b7c5-405a-93ff-3081c395624c.PNG?height=120&width=120';
          notification.data = new WebNotificationData();
          notification.data.url = this._appConfig.WEBURL + "/my/dashboard";

          let response = await this._notificationService.sendNotificationToMany({ notification, customerIds: [customerID] });

          const customerName = customer.title + ' ' + customer.firstName;
          const template = this._templateService.NOTIFICATION(customerName,message, type, code);
          let emailResponse = await this._emailService.SendEmail({ subject: type.toString(), to: customer.email, html: template, toCustomer: true });
        }
        catch (err: any) {
          console.log(err);
          errorList.push("Notification Failed to send to " + name);
        }
      });
      res.statusCode = 200;
      res.payload = { message: errorList.length > 0 ? errorList.join("; ") : "Notification was successful" };
      next();
    } catch (err: any) {
      res.statusCode = 400;
      res.payload = { message: "Notification Failed to send to " + name };
      next();
    }
  }
  @route('/sendtomultiple')
  @POST()
  sendToMultiple = async (req: VanaheimBodyRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
    try {
      const { notification } = req.body;
      this._notificationService.sendNotificationToMany({ notification, type: "All" }).then(response => {
        res.statusCode = 200;
        res.payload = { data: response };
        next();
      }).catch((err: any) => {
        res.statusCode = 400;
        res.payload = { message: "Notification Failed to send" };
        next();
      })
    } catch (err) {
      res.statusCode = 400;
      res.payload = { message: "Notification Failed to send" };
      next();
    }
  }
  @route('/send')
  @POST()
  send = async (req: VanaheimBodyRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
    const { notification, browserID } = req.body;
    const { userData } = req.session;
    this._notificationService.sendNotification({ notification, userID: userData.id, browserID }).then(response => {
      res.statusCode = 200;
      res.payload = response;
      next();
    }).catch((err: any) => {
      res.statusCode = 400;
      res.payload = { message: "Notification Failed to send" };
      next();
    })
  }
  @route('/subscribe')
  @POST()
  subscribe = async (req: VanaheimBodyRequest<any>, res: VanaheimTypedResponse<any>, next: any) => {
    const { token, browserID } = req.body;
    const { userData } = req.session;
    if (userData.id == 0) { res.statusCode = 200; res.payload = { data: { code: "01", message: "User is not yet registered" } }; }
    this._notificationService.subscribe({ token, userID: userData.id, browserID }).then(response => {
      res.statusCode = 200;
      res.payload = { data: response };
      next();
    }).catch((err: any) => {
      res.statusCode = 400;
      res.payload = { message: "Failed to subscribe" };
      next();
    })
  }

}


