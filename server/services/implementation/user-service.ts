import { UserCategory } from "@enums/usercategory";
import { User } from "@models/user";
import { BaseService } from "./base-service";
import { IUserService } from "@services/interfaces/Iuser-service";
import { IUserRepository } from "@repository/interface/Iuser-repository";
import { ICustomerRepository } from "@repository/interface/Icustomer-repository";
import { BaseStatus } from "@models/helpers/enums/status";
import Encryption from "@services/implementation/common/encryption-service";
import { Customer } from "@models/customer";
import UtilService from "./common/util";
import { LoginType } from "@models/helpers/enums/logintype";
import EmailService from "./common/email-service";
import { Staff } from "@models/staff";
import { IStaffRepository } from "@repository/interface/Istaff-repository";
import { TemplateService } from "./common/template-service";
class UserService extends BaseService<User> implements IUserService {
  constructor(private _userRepository: IUserRepository, private _templateService:TemplateService, private _emailService: EmailService, private _utils: UtilService, private _staffRepository: IStaffRepository, private _customerRepository: ICustomerRepository, private _encryption: Encryption) {
    super(_userRepository);
  }
  convertToModel = (modelInDb: any) => {
    return new Promise<User>(async (resolve, reject) => {
      let user: any;
      if (modelInDb && Object.keys(modelInDb).length > 0) {
        user = new User();
        user = modelInDb.dataValues as User ?? modelInDb;
        const customer = await this._customerRepository.getByUserID(user.id);
        if (customer && Object.keys(customer).length > 0) {
          user.customer = new Customer();
          user.customer = customer.dataValues as Customer;
          // user.customer.firstName =customer.dataValues.firstName;
          // user.customer.lastName = customer.dataValues.lastName;
          user.name = user.customer.firstName + " " + user.customer.lastName;
          console.log("Customer", user)
        }
      }
      resolve(user);
    });
  }
  convertToModelByCategory = (modelInDb: any, category: UserCategory) => {
    return new Promise<User>(async (resolve, reject) => {
      let user: any;
      if (modelInDb && Object.keys(modelInDb).length > 0) {
        user = new User();
        user = modelInDb.dataValues as User ?? modelInDb;
        if (category == UserCategory.Customer) {
          const customer = await this._customerRepository.getByUserID(user.id);
          if (customer && Object.keys(customer).length > 0) {
            user.customer = new Customer();
            user.customer = customer.dataValues as Customer;
            user.name = user.customer.firstName + " " + user.customer.lastName;
            console.log("Customer", user)
          }
        } else {
          const staff = await this._staffRepository.getByUserID(user.id);
          if (staff && Object.keys(staff).length > 0) {
            user.staff = new Staff();
            user.staff = staff.dataValues as Staff;
            user.name = user.staff.firstName + " " + user.staff.lastName;
            console.log("Staff", user)
          }
        }
      }
      resolve(user);
    });
  }
  getByUserName = (userName: string, category: UserCategory = UserCategory.Customer): any => {
    return new Promise<User>(async (resolve, reject) => {
      let userInDb = await this._userRepository.getByEmail(userName, category)
      if (!userInDb) userInDb = await this._userRepository.getByPhoneNumber(userName, category)

      let user: User = this.convertToModelByCategory(userInDb, category) as unknown as User;

      console.log("User", user)
      //await this._userRepository.getByUsername(userName)
      resolve(user);
    });
  }
  updateUserPassword = (userName: string, pwd: string) => {
    return new Promise<User>((resolve, reject) => { });

  }
  login = (payload: any) => {
    return new Promise<any>(async (resolve, reject) => {
      try {
        let uname = payload.username;
        let pwd = payload.password;
        let browserID = payload.browserID;
        let type = payload.type as LoginType;
        let socialUser = payload.socialUser;
        let loginAs = payload.loginAs;
        switch (loginAs) {
          case "Admin":
            resolve(await this.loginStaff({ type, socialUser, browserID, uname, pwd }))
            break;
          default:
            resolve(await this.loginCustomer({ type, socialUser, browserID, uname, pwd }));
            break;
        }
      } catch (err:any) {
        console.log(err);
        resolve({ status: false, message: "Oops, there seems to be an issue with your request" });
      }
    })
  }
  register = (payload: any) => {
    return new Promise<any>(async (resolve, reject) => {
      //Validate User
      //Create Customer
      //Create User
      try {
        if (payload.registerAs == "Admin") {
          resolve(await this.registerStaff(payload))

        } else {
          resolve(await this.registerCustomer(payload))
        }
      }

      catch (err: any) {
        reject(err);
      }
    });
  }
  private registerStaff = (payload: any) => {
    return new Promise<any>(async (resolve, reject) => {
      try {

        let user;
        let { email, firstName, lastName, password, phoneNumber, dateOfBirth, otherNames, address, role, position, type, gender, socialUser, browserID } = payload;

        user = await this.getByEmail(email, UserCategory.Staff);
        if (user) { resolve({ status: false, response: "This email has already been taken" }); return; }
        user = await this.getByPhoneNumber(phoneNumber, UserCategory.Staff);
        if (user) { resolve({ status: false, response: "This phone number has already been taken" }); return; }

        if (phoneNumber && phoneNumber.includes("+234")) phoneNumber = phoneNumber.replace('+234', '0')

        if (!user || Object.keys(user).length == 0) {
          user = new User();
          user.category = UserCategory.Staff;
          user.createdAt = new Date();
          user.email = email;
          user.phoneNumber = phoneNumber;
          user.username = email;
          user.status = BaseStatus.Active;
          user.code = this._utils.autogenerate({ prefix: "USER" });
          const encryptedPass: any = await this._encryption.generateHash(password);
          user.passwordHash = encryptedPass.hash;
          user.passwordSalt = encryptedPass.salt;
          user.name = firstName + ' ' + lastName;
          let userInDb = await this._userRepository.create(user);
          if (userInDb) {
            let staff = new Staff();
            staff.status = BaseStatus.Active;
            staff.email = email;
            staff.firstName = firstName;
            staff.lastName = lastName;
            staff.phoneNumber = phoneNumber;
            staff.createdAt = new Date();
            staff.userID = userInDb.id;
            staff.address = address ?? "Home";
            staff.otherNames = otherNames ?? "Others";
            staff.dateOfBirth = dateOfBirth ?? new Date();
            staff.role = role ?? "Admin";
            staff.position = position ?? "OPS";
            staff.gender = gender ?? "Male";
            staff.code = this._utils.autogenerate({ prefix: "STF" });
            user.staff = staff;

            let staffInDb = await this._staffRepository.create(staff);
            user.staff.id = staffInDb.id;
            if (staffInDb) {
              const template = `
    <div style="width:100% !important;  margin-top:20px;"><p>Dear ${staff.firstName},<br/><br/>
    Welcome to Vanir Capital LLC.<br/><br/>
    Congratulations. You now have access to Vanir Capital admin platform.<br/></br>
    Kindly contact Tech Support for your password.
    </div><br/><br/>
    `;
              try {
                let response = await this._emailService.SendEmail({ subject: "Vanaheim By Vanir For Staff", to: user.email, html: template, toCustomer: true })
                // resolve({status:true,data:user}); 

              }
              catch (err:any) {
                console.log("We were able to register the user but could not send you an email.");
                console.log(err);
              }
              resolve({ status: true, userData: user, data: { ...user, passwordHash: undefined, firstName: user.staff.firstName, type: type, lastName: user.staff.lastName } });

            }
            else resolve({ status: false, message: "Registration failed" })
          }

        } else {
          resolve({ status: true, data: user })
        }
      } catch (err: any) {
        reject(err)
      }
    })
  }
  private registerCustomer = (payload: any) => {
    return new Promise<any>(async (resolve, reject) => {
      try {

        let user;
        let { email, firstName, lastName, password, phoneNumber, type, socialUser, browserID } = payload;
        if (type == LoginType.Social) {
          email = socialUser.email;
          firstName = socialUser.firstName;
          lastName = socialUser.lastName;
          password = socialUser.id;
          delete (socialUser.id);
          phoneNumber = "";
          const u = await this.getByEmail(email, UserCategory.Customer);
          if (u && Object.keys(u).length > 0) user = u;
        }
        else {
          user = await this.getByEmail(email, UserCategory.Customer);
          if (user) { resolve({ status: false, response: "This email has already been taken" }); return; }
          user = await this.getByPhoneNumber(phoneNumber, UserCategory.Customer);
          if (user) { resolve({ status: false, response: "This phone number has already been taken" }); return; }
        }
        if (phoneNumber && phoneNumber.includes("+234")) phoneNumber = phoneNumber.replace('+234', '0')

        if (!user || Object.keys(user).length == 0) {
          user = new User();
          user.category = UserCategory.Customer;
          user.createdAt = new Date();
          user.email = email;
          user.phoneNumber = phoneNumber;
          user.username = email;
          user.status = BaseStatus.Active;
          user.code = this._utils.autogenerate({ prefix: "USER" });
          const encryptedPass: any = await this._encryption.generateHash(password);
          user.passwordHash = encryptedPass.hash;
          user.passwordSalt = encryptedPass.salt;
          user.name = firstName + ' ' + lastName;
          let userInDb = await this._userRepository.create(user);
          if (userInDb) {
            let customer = new Customer();
            customer.status = BaseStatus.Active;
            customer.email = email;
            customer.firstName = firstName;
            customer.lastName = lastName;
            customer.phoneNumber = phoneNumber;
            customer.createdAt = new Date();
            customer.userID = userInDb.id;
            customer.code = this._utils.autogenerate({ prefix: "CUST" });
            user.customer = customer;

            let customerInDb = await this._customerRepository.create(customer);
            user.customer.id = customerInDb.id;
            if (customerInDb) {
              ;
              try {
                let response = await this._emailService.SendEmail({ subject: "WELCOME TO VANIR CAPITAL LLC", to: user.email, html: this._templateService.NEW_CUSTOMER_TEMPLATE(customer?(customer.firstName+' '+customer.lastName):"Customer"), toCustomer: true })
                // resolve({status:true,data:user}); 

              }
              catch (err:any) {
                console.log("We were able to register the user but could not send you an email.");
                console.log(err);
              }
              resolve({ status: true, userData: user, data: { ...user, passwordHash: undefined, firstName: user.customer.firstName, type: type, lastName: user.customer.lastName } });

            }
            else resolve({ status: false, message: "Registration failed" })
          }

        } else {
          resolve({ status: true, data: user })
        }
      } catch (err: any) {
        reject(err)
      }
    })
  }

  private loginStaff = ({ type, socialUser, browserID, uname, pwd }: any) => {
    return new Promise<any>(async (resolve, reject) => {
      let staff: Staff = new Staff();
      if (type == LoginType.Social) {
        const { firstName, lastName, email, name, photoUrl } = socialUser;
        let id = 0;
        let userDetails = await this.getByUserName(email, UserCategory.Staff);
        if (userDetails) {
          if (userDetails.category != UserCategory.Staff) {
            resolve({ status: false, message: "Invalid login details" });
            return;
          }
          id = userDetails.id;
          let staffInDb = await this._staffRepository.getByUserID(id);
          console.log("Social staff", staffInDb);
          if (staffInDb && Object.keys(staffInDb).length > 0) {
            staff = staffInDb.dataValues as Staff;
          }

        } else {
          resolve({ status: false, message: "You don't seem to have an account 😕" })
        }

        resolve({
          status: true, data: { category: UserCategory.Staff, firstName, lastName, username: email, id },
          userData: { ...socialUser, id, category: UserCategory.Staff, firstName, lastName, username: email, staff: staff }
        });
      }
      else {
        let userDetails = await this.getByUserName(uname, UserCategory.Staff);

        if (userDetails && Object.keys(userDetails).length > 0) {
          if (userDetails.category != UserCategory.Staff) resolve({ status: false, message: "Invalid login details" });

          let { passwordHash } = userDetails;
          if (await this._encryption.compare(pwd, passwordHash) == true) {
            //register the users device
            resolve({
              status: true, data: { ...userDetails, passwordHash: undefined, type, firstName: userDetails.staff?.firstName, lastName: userDetails.staff?.lastName },
              userData: userDetails
            })
          } else {
            resolve({ status: false, message: 'Either your username or password is incorrect 😕' })
          }
        } else {
          //  res.statusCode = 400;
          resolve({ status: false, message: "You don't seem to have an account 😕" })
          return;
        }
      }
    })
  }
  private loginCustomer = ({ type, socialUser, browserID, uname, pwd }: any) => {
    return new Promise<any>(async (resolve, reject) => {
      let customer: Customer = new Customer();
      if (type == LoginType.Social) {
        const { firstName, lastName, email, name, photoUrl } = socialUser;
        let id = 0;
        let userDetails = await this.getByUserName(email);
        if (userDetails) {
          if (userDetails.category != UserCategory.Customer) resolve({ status: false, message: "Invalid login details" });
          id = userDetails.id;
          let customerInDb = await this._customerRepository.getByUserID(id);
          console.log("Social Customer", customerInDb);
          if (customerInDb && Object.keys(customerInDb).length > 0) {
            customer = customerInDb.dataValues as Customer;
          }

        } else {
          resolve(await this.register({ socialUser, browserID }));
        }

        resolve({
          status: true, data: { category: UserCategory.Customer, firstName, lastName, username: email, id },
          userData: { ...socialUser, id, category: UserCategory.Customer, firstName, lastName, username: email, customer: customer }
        });
      }
      else {
        let userDetails = await this.getByUserName(uname);

        if (userDetails && Object.keys(userDetails).length > 0) {
          if (userDetails.category != UserCategory.Customer) resolve({ status: false, message: "Invalid login details" });

          let { passwordHash } = userDetails;
          if (await this._encryption.compare(pwd, passwordHash) == true) {
            //register the users device
            resolve({
              status: true, data: { ...userDetails, passwordHash: undefined, type, firstName: userDetails.customer.firstName, lastName: userDetails.customer.lastName },
              userData: userDetails
            })
          } else {
            resolve({ status: false, message: 'Either your username or password is incorrect 😕' })
          }
        } else {
          //  res.statusCode = 400;
          resolve({ status: false, message: "You don't seem to have an account 😕" })
          return;
        }
      }
    })
  }
  resetPassword = (payload: any) => {
    return new Promise<any>(async (resolve, reject) => {
      const { username } = payload;
      let userInDB = await this.getByUserName(username);
      if (userInDB && Object.keys(userInDB).length > 0) {
        let user = userInDB as User ?? userInDB;
        const password = this._utils.randPassword(4, 2, 2);
        const encryptedPass: any = await this._encryption.generateHash(password);
        user.passwordHash = encryptedPass.hash;
        user.passwordSalt = encryptedPass.salt;
        user.updatedAt = new Date();
        const updatedUser = await this._userRepository.update(user);

        if (updatedUser && Object.keys(updatedUser).length > 0) {
          //   const template = `<div style="width:100% !important;  margin-top:20px;"><p>Dear ${user.name},<br/><br/>
          //   You just reset your password<br/><br/>
          //   Your new login details:<br/><br/>
          //  Username: ${username}<br/><br/>
          //   Password: ${password} <br/><br/>
          //   Thank you for sticking with us.<br/><br/>
          //   Best regards.<br><br><b>Vanir Capital Loans and Capital Finance Team</b></p><div>`;
          const template = `
      <div style="width:100% !important;  margin-top:20px;"><p>Dear ${user.name},<br/><br/>
      There was a request to change your password.
If you didn’t make this request, please ignore this email.<br/>
Otherwise, use this code ${password}
Remember to always change your password immediately after reset.<br/>
Thanks for sticking with us.
Best Regards,<div>
      `;
          try {
            let response = await this._emailService.SendEmail({ subject: "Vanaheim By Vanir: Password Reset", to: user.email, html: template, toCustomer: true })
            resolve({ status: true, data: user });
          }
          //  .then(response=>{
          //   console.log("Responding after email sent")
          //   resolve({status:true,data:user});
          //  })
          //  .
          catch (err:any) {
            resolve({ status: false, message: "We were able to reset your password, but could not send you an email. Kindly " });

          }
        } else {

          resolve({ status: false, message: "Sorry we could not reset your password at the moment please try again later" });
        }
      } else {

        resolve({ status: false, message: "You don't seem to have an account with us yet. Try registering" });
      }


    });
  }

  getByEmail = (email: string, category: UserCategory) => {
    return new Promise<User>(async (resolve, reject) => {
      const userInDb = await this._userRepository.getByEmail(email, category);

      let user: User = this.convertToModel(userInDb) as unknown as User;
      resolve(user);
    });
  }
  getByPhoneNumber = (phoneNumber: string, category: UserCategory) => {
    return new Promise<User>(async (resolve, reject) => {
      const userInDb = await this._userRepository.getByEmail(phoneNumber, category);

      let user: User = this.convertToModel(userInDb) as unknown as User;
      resolve(user);

    });
  }
  getByCustomerId = (customerId: number) => {
    return new Promise<User>((resolve, reject) => { });
  }
  getByStaffId = (staffId: number) => {
    return new Promise<User>((resolve, reject) => { });
  }
  search = (parameters: object, pageNumber: number, maxSize: number) => {
    return new Promise<User>((resolve, reject) => { });
  }
  getAllByCategory = (category: UserCategory) => {
    return new Promise<User[]>((resolve, reject) => {
      this.getAll();
    });
  }
}


export default UserService