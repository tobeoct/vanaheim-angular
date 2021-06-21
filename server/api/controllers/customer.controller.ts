import { Customer } from '@models/customer';
import { NOK } from '@models/nok';
import { CollateralRepository } from '@repository/implementation/collateral-repository';
import { CompanyRepository } from '@repository/implementation/company-repository';
import { CustomerRepository } from '@repository/implementation/customer-repository';
import { EmploymentRepository } from '@repository/implementation/employment-repository';
import { NOKRepository } from '@repository/implementation/nok-repository';
import { ShareholderRepository } from '@repository/implementation/shareholder-repository';
import { GET, POST, route } from 'awilix-express'; 
const expAutoSan = require('express-autosanitizer');

// const accountList:any={};
@route('/api/customer')
export default class CustomerController {

    constructor( private _customerRepository:CustomerRepository, private _employmentRepository:EmploymentRepository, private _nokRepository:NOKRepository, private _companyRepository:CompanyRepository, private _shareholderRepository:ShareholderRepository, private _collateralRepository:CollateralRepository) {

    }

    @route('/')
    @GET()
     customer=async (req:any, res:any,next:any) => {
try{
      let user = req.session?.userData;
      if(user){
          let customer:any =await this._customerRepository.getByUserID(user.id);
          if(customer){
              customer = customer.dataValues as Customer;
          }
          res.statusCode =200;
          res.data= customer;
      }else{
        res.statusCode =400;
        res.data = {status:false,message:"Invalid user"}

      }
}
catch(err){
  res.statusCode =400;
  res.data = {status:false,message:"Failed to get customer info"}
}
      next();
    }

    
    @route('/employers')
    @GET()
     employers=async (req:any, res:any,next:any) => {
try{
      let customer = req.session?.userData?.customer as Customer;
      if(customer){
          let employers =await this._employmentRepository.getByCustomerID(customer.id);
      
          res.statusCode =200;
          res.data= employers;
      }else{
        res.statusCode =400;
        res.data = {status:false,message:"Invalid user"}

      }
}
catch(err){
  res.statusCode =400;
  res.data = {status:false,message:"Failed to get employers info"}
}
      next();
    }

    
    
    @route('/nok')
    @GET()
     nok=async (req:any, res:any,next:any) => {
try{
      let customer = req.session?.userData?.customer as Customer;
      if(customer){
          let nok:any =await this._nokRepository.getByCustomerID(customer.id);
        if(nok){
            nok = nok.dataValues as NOK;
        }
          res.statusCode =200;
          res.data= nok?nok:{};
        
      }else{
        res.statusCode =400;
        res.data = {status:false,message:"Invalid customer"}

      }
}
catch(err){
  res.statusCode =400;
  res.data = {status:false,message:"Failed to get Next Of Kin info"}
}
      next();
    }


    
    @route('/companies')
    @GET()
     companies=async (req:any, res:any,next:any) => {
try{
      let customer = req.session?.userData?.customer as Customer;
      if(customer){
          let companies =await this._companyRepository.getByCustomerID(customer.id);
          res.statusCode =200;
          res.data= companies;
        
      }else{
        res.statusCode =400;
        res.data = {status:false,message:"Invalid customer"}

      }
}
catch(err){
  res.statusCode =400;
  res.data = {status:false,message:"Failed to get Company info"}
}
      next();
    }

    
    @route('/shareholders')
    @POST()
     shareholders=async (req:any, res:any,next:any) => {
        try{
            let customer = req.session?.userData?.customer as Customer;
            console.log(req.body)
            if(customer){
                if(!req.body){
                    res.statusCode =400;
                    res.data = {status:false,message:"No company id specified"}    
                }
                let shareholders =await this._shareholderRepository.getByCompanyID(req.body.companyID);
                res.statusCode =200;
                res.data= shareholders;
                
            }else{
                res.statusCode =400;
                res.data = {status:false,message:"Invalid customer"}

            }
        }
        catch(err){
        res.statusCode =400;
        res.data = {status:false,message:"Failed to get Shareholders info"}
        }
      next();
    }

    
    @route('/collaterals')
    @GET()
     collaterals=async (req:any, res:any,next:any) => {
try{
      let customer = req.session?.userData?.customer as Customer;
      if(customer){
          let collaterals =await this._collateralRepository.getByCustomerID(customer.id);
          res.statusCode =200;
          res.data= collaterals;
        
      }else{
        res.statusCode =400;
        res.data = {status:false,message:"Invalid customer"}

      }
}
catch(err){
  res.statusCode =400;
  res.data = {status:false,message:"Failed to get Collateral info"}
}
      next();
    }

    
}