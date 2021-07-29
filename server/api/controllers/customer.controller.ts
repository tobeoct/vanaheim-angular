import { Customer } from '@models/customer';
import { Gender } from '@models/helpers/enums/gender';
import { MaritalStatus } from '@models/helpers/enums/maritalstatus';
import { Relationship } from '@models/helpers/enums/relationship';
import { NOK } from '@models/nok';
import { CollateralRepository } from '@repository/implementation/collateral-repository';
import { CompanyRepository } from '@repository/implementation/company-repository';
import { CustomerRepository } from '@repository/implementation/customer-repository';
import { EmploymentRepository } from '@repository/implementation/employment-repository';
import { NOKRepository } from '@repository/implementation/nok-repository';
import { ShareholderRepository } from '@repository/implementation/shareholder-repository';
import UtilService from '@services/implementation/common/util';
import { GET, POST, PUT, route } from 'awilix-express';
const expAutoSan = require('express-autosanitizer');

// const accountList:any={};
@route('/api/customer')
export default class CustomerController {

  constructor(private sanitizer: any, private _utilService: UtilService, private _customerRepository: CustomerRepository, private _employmentRepository: EmploymentRepository, private _nokRepository: NOKRepository, private _companyRepository: CompanyRepository, private _shareholderRepository: ShareholderRepository, private _collateralRepository: CollateralRepository) {

  }

  @route('/')
  @GET()
  customer = async (req: any, res: any, next: any) => {
    try {
      let user = req.session?.userData;
      if (user) {
        let customer: any = await this._customerRepository.getByUserID(user.id);
        if (customer) {
          customer = customer.dataValues as Customer;
        }
        res.statusCode = 200;
        res.data = customer;
      } else {
        res.statusCode = 400;
        res.data = { status: false, message: "Invalid user" }

      }
    }
    catch (err) {
      res.statusCode = 400;
      res.data = { status: false, message: "Failed to get customer info" }
    }
    next();
  }

  @route('/all')
  @GET()
  customers = async (req: any, res: any, next: any) => {
    try {
      let user = req.session?.userData;
      if (user) {
        let customers: any = await this._customerRepository.getAll();
       
        res.statusCode = 200;
        res.data = customers;
      } else {
        res.statusCode = 400;
        res.data = { status: false, message: "Invalid user" }

      }
    }
    catch (err) {
      res.statusCode = 400;
      res.data = { status: false, message: "Failed to get customer info" }
    }
    next();
  }

  @route('/bvn')
  @GET()
  getCustomerBVN = async (req: any, res: any, next: any) => {
    try {
      let user = req.session?.userData;
      if (user) {
        let customer: any = await this._customerRepository.getByUserID(user.id);
        if (customer) {
          customer = customer.dataValues as Customer;
        }
        res.statusCode = 200;
        res.data = customer.BVN;
      } else {
        res.statusCode = 400;
        res.data = { status: false, message: "Invalid user" }

      }
    }
    catch (err) {
      res.statusCode = 400;
      res.data = { status: false, message: "Failed to get customer info" }
    }
    next();
  }

  @route('/update')
  @PUT()
  updateCustomer = async (req: any, res: any, next: any) => {
    try {
      let user = req.session?.userData;
      let customerToUpdate = req.body;
      if (user) {
        let customer: any = await this._customerRepository.getByUserID(user.id);
        if (customer) {
          let c = customer.dataValues as Customer;
          c.title = this.sanitizer.escape(customerToUpdate.title);
          c.firstName = this.sanitizer.escape(customerToUpdate.firstName);
          c.lastName = this.sanitizer.escape(customerToUpdate.surname);
          c.otherNames = this.sanitizer.escape(customerToUpdate.otherNames);
          c.email = this.sanitizer.escape(customerToUpdate.email);
          c.phoneNumber = this.sanitizer.escape(customerToUpdate.phoneNumber);
          c.gender = this.sanitizer.escape(customerToUpdate.gender) as unknown as Gender
          c.maritalStatus = this.sanitizer.escape(customerToUpdate.maritalStatus) as unknown as MaritalStatus
          c.dateOfBirth = this._utilService.toDate(this.sanitizer.escape(customerToUpdate.dob.day), this.sanitizer.escape(customerToUpdate.dob.month), this.sanitizer.escape(customerToUpdate.dob.year));
          c.address = this._utilService.toAddress(this.sanitizer.escape(customerToUpdate.address.street), this.sanitizer.escape(customerToUpdate.address.city), this.sanitizer.escape(customerToUpdate.address.state));
          this._customerRepository.update(customer);
        }
        res.statusCode = 200;
        res.data = "Updated successfully";
      } else {
        res.statusCode = 400;
        res.data = { status: false, message: "Invalid user" }

      }
    }
    catch (err) {
      res.statusCode = 400;
      res.data = { status: false, message: "Failed to update your info" }
    }
    next();
  }

  @route('/getById')
  @GET()
  customerById = async (req: any, res: any, next: any) => {
    try {
      var id = this.sanitizer.escape(req.query.id);
      let customer: any = await this._customerRepository.getById(id);
      if (customer) {
        customer = customer.dataValues as Customer;
      }
      res.statusCode = 200;
      res.data = customer;

    }
    catch (err) {
      res.statusCode = 400;
      res.data = { status: false, message: "Failed to get customer info" }
    }
    next();
  }


  @route('/employers')
  @GET()
  employers = async (req: any, res: any, next: any) => {
    try {
      let customer = req.session?.userData?.customer as Customer;
      if (customer) {
        let employers = await this._employmentRepository.getByCustomerID(customer.id);

        res.statusCode = 200;
        res.data = employers;
      } else {
        res.statusCode = 400;
        res.data = { status: false, message: "Invalid user" }

      }
    }
    catch (err) {
      res.statusCode = 400;
      res.data = { status: false, message: "Failed to get employers info" }
    }
    next();
  }



  @route('/nok')
  @GET()
  nok = async (req: any, res: any, next: any) => {
    try {
      let customer = req.session?.userData?.customer as Customer;
      if (customer) {
        let nok: any = await this._nokRepository.getByCustomerID(customer.id);
        if (nok) {
          nok = nok.dataValues as NOK;
        }
        res.statusCode = 200;
        res.data = nok ? nok : {};

      } else {
        res.statusCode = 400;
        res.data = { status: false, message: "Invalid customer" }

      }
    }
    catch (err) {
      res.statusCode = 400;
      res.data = { status: false, message: "Failed to get Next Of Kin info" }
    }
    next();
  }


  @route('/updateNOK')
  @PUT()
  updateNOK = async (req: any, res: any, next: any) => {
    try {
      let customer = req.session?.userData?.customer as Customer;
      let nokInfo = req.body;
      if (customer) {
        let nok: any = await this._nokRepository.getByCustomerID(customer.id);
        if (nok) {
          nok = nok.dataValues as NOK;
          nok.dateOfBirth = this._utilService.toDate(this.sanitizer.escape(nokInfo.dob.day), this.sanitizer.escape(nokInfo.dob.month), this.sanitizer.escape(nokInfo.dob.year));
          nok.email = this.sanitizer.escape(nokInfo.email);
          nok.otherNames = this.sanitizer.escape(nokInfo.otherNames);
          nok.lastName = this.sanitizer.escape(nokInfo.surname);
          nok.firstName = this.sanitizer.escape(nokInfo.otherNames);
          nok.relationship = this.sanitizer.escape(nokInfo.relationship) as unknown as Relationship;
          nok.phoneNumber = this.sanitizer.escape(nokInfo.phoneNumber);
          nok.title = this.sanitizer.escape(nokInfo.title);
          this._nokRepository.update(nok);
        }
        res.statusCode = 200;
        res.data =  "Updated successfully";

      } else {
        res.statusCode = 400;
        res.data = { status: false, message: "Invalid customer" }

      }
    }
    catch (err) {
      res.statusCode = 400;
      res.data = { status: false, message: "Failed to update Next Of Kin info" }
    }
    next();
  }



  @route('/companies')
  @GET()
  companies = async (req: any, res: any, next: any) => {
    try {
      let customer = req.session?.userData?.customer as Customer;
      if (customer) {
        let companies = await this._companyRepository.getByCustomerID(customer.id);
        res.statusCode = 200;
        res.data = companies;

      } else {
        res.statusCode = 400;
        res.data = { status: false, message: "Invalid customer" }

      }
    }
    catch (err) {
      res.statusCode = 400;
      res.data = { status: false, message: "Failed to get Company info" }
    }
    next();
  }


  @route('/shareholders')
  @POST()
  shareholders = async (req: any, res: any, next: any) => {
    try {
      let customer = req.session?.userData?.customer as Customer;
      console.log(req.body)
      if (customer) {
        if (!req.body) {
          res.statusCode = 400;
          res.data = { status: false, message: "No company id specified" }
        }
        let shareholders = await this._shareholderRepository.getByCompanyID(req.body.companyID);
        res.statusCode = 200;
        res.data = shareholders;

      } else {
        res.statusCode = 400;
        res.data = { status: false, message: "Invalid customer" }

      }
    }
    catch (err) {
      res.statusCode = 400;
      res.data = { status: false, message: "Failed to get Shareholders info" }
    }
    next();
  }


  @route('/collaterals')
  @GET()
  collaterals = async (req: any, res: any, next: any) => {
    try {
      let customer = req.session?.userData?.customer as Customer;
      if (customer) {
        let collaterals = await this._collateralRepository.getByCustomerID(customer.id);
        res.statusCode = 200;
        res.data = collaterals;

      } else {
        res.statusCode = 400;
        res.data = { status: false, message: "Invalid customer" }

      }
    }
    catch (err) {
      res.statusCode = 400;
      res.data = { status: false, message: "Failed to get Collateral info" }
    }
    next();
  }


}