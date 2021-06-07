import AppConfig from "@api/config";
import { Account } from "@models/account";
import { IBaseEntity } from "@models/base-entity";
import { Collateral } from "@models/collateral";
import { Company } from "@models/company";
import { Customer } from "@models/customer";
import { Document } from "@models/document";
import { Employment } from "@models/employment";
import { Gender } from "@models/helpers/enums/gender";
import { LoanRequestStatus } from "@models/helpers/enums/loanrequeststatus";
import { MaritalStatus } from "@models/helpers/enums/maritalstatus";
import { Relationship } from "@models/helpers/enums/relationship";
import { BaseStatus } from "@models/helpers/enums/status";
import { LoanRequest } from "@models/loan/loan-request";
import { LoanRequestLog } from "@models/loan/loan-request-log";
import { LoanTypeRequirements } from "@models/loan/loan-type-requirements";
import { NOK } from "@models/nok";
import { Shareholder } from "@models/shareholder";
import { IDocumentRepository } from "@repository/interface/document/Idocument-repository";
import { IAccountRepository } from "@repository/interface/Iaccount-repository";
import { ICollateralRepository } from "@repository/interface/Icollateral-repository";
import { ICompanyRepository } from "@repository/interface/Icompany-repository";
import { ICustomerRepository } from "@repository/interface/Icustomer-repository";
import { IEmploymentRepository } from "@repository/interface/Iemployment-repository";
import { ILoanTypeRequirementRepository } from "@repository/interface/Iloantyperequirement-repository";
import { INOKRepository } from "@repository/interface/Inok-repository";
import { IShareholderRepository } from "@repository/interface/Ishareholder-repository";
import { ILoanRequestLogRepository } from "@repository/interface/loan/Iloan-request-log-repository";
import { ILoanRequestRepository } from "@repository/interface/loan/Iloan-request-repository";
import { ILoanRequestService } from "@services/interfaces/loan/Iloan-request-service";
import { CollateralInfo } from "src/app/modules/loan/business/collateral-info/collateral-info";
import { CompanyInfo } from "src/app/modules/loan/business/company-info/company-info";
import { ShareholderInfo } from "src/app/modules/loan/business/shareholder-info/shareholder-info";
import { BVN } from "src/app/modules/loan/personal/bvn/bvn";
import { EmploymentInfo } from "src/app/modules/loan/personal/employment-info/employment-info";
import { NOKInfo } from "src/app/modules/loan/personal/nok-info/nok-info";
import { PersonalInfo } from "src/app/modules/loan/personal/personal-info/personal-info";
import { AccountInfo } from "src/app/modules/loan/shared/account-info/account-info";
import { LoanDetails } from "src/app/modules/loan/shared/loan-calculator/loan-details";
import { BaseService } from "../base-service";
import EmailService from "../common/email-service";
import { TemplateService } from "../common/template-service";
import UtilService from "../common/util";

export class LoanRequestService extends BaseService<LoanRequest> implements ILoanRequestService{
    convertToModel: (modelInDb: any) => Promise<LoanRequest>;
    constructor(private moment:any,private _loanRequestLogRepository:ILoanRequestLogRepository ,private _customerRepository:ICustomerRepository, private _accountRepository:IAccountRepository,private _nokRepository:INOKRepository,private _companyRepository:ICompanyRepository,private _shareholderRepository:IShareholderRepository,private _collateralRepository:ICollateralRepository,private _employmentRepository:IEmploymentRepository,private _loanTypeRequirementRepository:ILoanTypeRequirementRepository,private _utilService:UtilService, _loanRequestRepository:ILoanRequestRepository){
        super(_loanRequestRepository);
    }
    process= (payload:any) =>new Promise<any>((resolve, reject) =>{
      
    });
    search=(parameters:any,userData:any) =>  new Promise<any>(async (resolve,reject)=>{
        try{
            const {pageNumber,maxSize,from,to} = parameters;

        let repo = this._baseRepository as ILoanRequestRepository;
        const customer = await this._customerRepository.getByUserID(userData.id);
        let requests = await repo.search({customerID:customer.id},pageNumber,maxSize);
        resolve({status:true,data:requests});
        }
        catch(err){
            console.error(err);
            resolve({status:false,data:err});
        }
    });

    getLatestLoan=(userData:any) =>  new Promise<any>(async (resolve,reject)=>{
        try{
           

        let repo = this._baseRepository as ILoanRequestRepository;
        const customer = await this._customerRepository.getByUserID(userData.id);

        let queryParameters:any = {customerID:customer.id};
            // queryParameters["requestStatus"] = {$not:"Approved"}; 
        // queryParameters["order"]= [['requestDate', 'DESC']]
        let requests = await repo.search({...queryParameters},0,1,[['requestDate', 'DESC']]);
        // console.log("Latest Loan Requests",requests)
        resolve({status:true,data:requests?requests["rows"][0]?requests["rows"][0]:{}:{}});
        }
        catch(err){
            console.error(err);
            resolve({status:false,message:err});
        }
    });
    getByCustomerID=(customerID:number) =>  new Promise<LoanRequest>(async (resolve,reject)=>{
        try{
        let repo = this._baseRepository as ILoanRequestRepository;
        let request = await repo.getByCustomerID(customerID);
        // console.log("Loan Request",request);
        resolve(request);
        }
        catch(err){
            console.error(err);
            reject(err);
        }
    });
  createLoanRequest= (request: any,customer:Customer) =>  new Promise<any>(async (resolve,reject)=>{
    try{
       const category = request.category;
       let templates:IBaseEntity[] = [];
       
       
    // this._templateService.generatePDF("Loan Application",[c],"Test");
       let loanRequest = await this.getByCustomerID(customer.id);
       console.log("loan Request", loanRequest)
       if(loanRequest && loanRequest.requestStatus!= LoanRequestStatus.NotQualified &&loanRequest.requestStatus!= LoanRequestStatus.Approved){
       throw "You have a loan that we are currently still processing";
           
       }else{
        loanRequest =  new LoanRequest();

       }
        

       
       const loanApplication = request.loanApplication;
       const loanType = loanApplication.loanType;
       const applyingAs = loanApplication.applyingAs;
       const loanProduct= loanApplication.loanProduct;
       if(!loanApplication.loanCalculator) throw "Please provide loan details";
       const loanDetails:LoanDetails = JSON.parse(loanApplication.loanCalculator) as LoanDetails;
       if(!loanDetails || Object.keys(loanDetails).length==0) throw "Please provide loan details";
       if(!loanApplication.accountInfo) throw "Please provide account details";
       const accountInfo:AccountInfo[] = JSON.parse(loanApplication.accountInfo) as AccountInfo[];
       if(!accountInfo || accountInfo.length<1) throw "Please provide account details";
 
        loanRequest.createdAt = new Date();
        loanRequest.requestId = this._utilService.autogenerate({prefix:"LOAN"});
        loanRequest.code = loanRequest.requestId;
        loanRequest.requestStatus = LoanRequestStatus.Pending;
        //Fetch from db  or cache instead
        // loanRequest.loanType = new LoanType();
        loanRequest.loanType = loanType;
        // loanRequest.loanType.code = this._utilService.autogenerate({prefix:"LTYP"});
        loanRequest.applyingAs = applyingAs;
        // Fetch from db or cache instead
        // loanRequest.loanProduct= new LoanProduct();
        loanRequest.loanProduct = loanProduct;
        loanRequest.requestDate = new Date();
        loanRequest.status = BaseStatus.Active;
        loanRequest.loanPurpose = loanDetails.purpose;
        loanRequest.tenure = loanDetails.tenure;
        loanRequest.amount = this._utilService.convertToPlainNumber(loanDetails.loanAmount);
        loanRequest.monthlyPayment= this._utilService.convertToPlainNumber(loanDetails.monthlyRepayment);
        loanRequest.totalRepayment = this._utilService.convertToPlainNumber(loanDetails.totalRepayment);
        loanRequest.rate = loanDetails.rate||0;
        let mDate=this.moment().add(+loanDetails.tenure,loanDetails.denominator.toLowerCase());
        loanRequest.maturityDate  = mDate.format("MMMM Do YYYY");
       loanRequest.loanTypeRequirementID = 0;
        //Check is account exists first
        let account1 = new Account();
        let account2 = new Account();
        let accountsInDb:Account[] = await this._accountRepository.getByCustomerID(customer.id) as Account[];
        if(!accountInfo[0].id || accountInfo[0].id==0){
          let accountInDb =accountsInDb.find(c=>c.bank==accountInfo[0].bank && c.number ==accountInfo[0].accountNumber);
            if(!accountInDb){
               account1 = new Account();
            account1.bank = accountInfo[0].bank;
            account1.code = this._utilService.autogenerate({prefix:"ACC"});
            account1.createdAt = new Date();
            account1.customerID = customer.id;
            account1.number = accountInfo[0].accountNumber;
            account1.name = accountInfo[0].accountName;
            console.log(account1)
            let accountInDb=await  this._accountRepository.create(account1);
            console.log("accountInDb",accountInDb);
            
            }
            else{
              
            account1 =Object.assign(accountInDb,new Account());
            }
        }else{
            let a:any= this._accountRepository.getById(accountInfo[0].id);
            if(!a||Object.keys(a).length==0) throw "Invalid account";
            account1 =Object.assign(a.dataValues as Account,new Account());
        }

        if(accountInfo.length>1){
            if(!accountInfo[1].id || accountInfo[1].id==0){
                let accountInDb =accountsInDb.find(c=>c.bank==accountInfo[1].bank && c.number ==accountInfo[1].accountNumber);
            if(!accountInDb){
                account2.bank = accountInfo[1].bank;
                account2.code = this._utilService.autogenerate({prefix:"ACC"});
                account2.createdAt = new Date();
                account2.customerID = customer.id;
                // account2.customerID = 1;
                account2.number = accountInfo[1].accountNumber;
                account2.name = accountInfo[1].accountName;
                console.log(account2)
                let accountInDb= await this._accountRepository.create(account2);
                console.log("accountInDb",accountInDb);
            } else{
              
              account2 =Object.assign(accountInDb,new Account());
              }

            }
            else{
                let a:any= this._accountRepository.getById(accountInfo[1].id);
                if(!a||Object.keys(a).length==0) throw "Invalid account";
                account2 =Object.assign(a.dataValues as Account,new Account());
            }
        }

        loanRequest.accountNumber  = accountInfo.length>1?account2.number:account1.number;
        loanRequest.denominator = "Months";
        loanRequest.customerID = customer.id;
        let loanRequestInDb = await this._baseRepository.create(loanRequest);
        console.log(loanRequestInDb);
        let loanRequestLog  = loanRequest as LoanRequestLog;
        loanRequestLog.loanRequestID = loanRequestInDb.id;
        let loanRequestLogInDb = await this._loanRequestLogRepository.create(loanRequestLog);
        loanRequest.loanTypeRequirements = await this.createLoanRequirement(loanApplication,category,customer);
        loanRequest.loanTypeRequirements.loanRequestLogID = loanRequestLogInDb.id||0;
        loanRequest.loanTypeRequirements.loanType = loanRequest.loanType;

        let ltRInDb = await this._loanTypeRequirementRepository.create(loanRequest.loanTypeRequirements);
        console.log("ltRInDb",ltRInDb);
         loanRequest.loanTypeRequirementID = ltRInDb.id;
         loanRequest.id = loanRequestInDb.id;
        // save loan requirements 
     console.log(loanRequest);
        loanRequestInDb = await this._baseRepository.update(loanRequest);
      
        templates.push(loanRequest);
        templates.push(account1);
        if(account2.bank)templates.push(account2);
        if(category=="personal"){
            templates.push(loanRequest.loanTypeRequirements.nok.customer)
            templates.push(loanRequest.loanTypeRequirements.employment)
            templates.push(loanRequest.loanTypeRequirements.nok)
        }else{
          templates.push(loanRequest.loanTypeRequirements.company)
          templates.push(...loanRequest.loanTypeRequirements.shareholders)
          templates.push(loanRequest.loanTypeRequirements.collateral)
        }
       
        resolve({loanRequest,templates});
    }catch(err){
      console.log(err);
        reject(err);
        // resolve({status:false, data:err.message});
    }
 })

 private createLoanRequirement= (loanApplication:any,category:string,customer:Customer) =>new Promise<any>(async(resolve, reject) =>{
     try{
    let loanTypeRequirements = new LoanTypeRequirements();
    let companyInfo:CompanyInfo;
    let shareholderInfos:ShareholderInfo[];
    let collateralInfo:CollateralInfo;
 
    let employmentInfo:EmploymentInfo;
    let personalInfo:PersonalInfo;
    let nokInfo:NOKInfo;
    let bvnInfo:BVN;
    // let c = customer.dataValues as Customer;
   if(category=="personal"){
     bvnInfo = JSON.parse(loanApplication.bvn) as BVN;
     if(!bvnInfo.tc || !bvnInfo.privacy) throw "Terms have not been accepted. Kindly accept";
 
     //For NOK
     console.log("NOK INFO")
     let nok:NOK;
     let n:any =await  this._nokRepository.getByCustomerID(customer.id);
     console.log(n)
     if(!n||Object.keys(n).length==0){
        nok = new NOK();
        nok.id = 0;
     }else{
        //  nok = n.dataValues as NOK;
        nok= Object.assign(n.dataValues as NOK,new NOK());
     }
     if(!loanApplication.nokInfo) throw "Please provide next of kin details";
     nokInfo = JSON.parse(loanApplication.nokInfo) as NOKInfo;
     if(!nok || nok.id==0){ 
       if(!nokInfo || Object.keys(nokInfo).length==0) throw "Please provide your Next Of Kin details";
      
       nok.createdAt = new Date();
       nok.code = this._utilService.autogenerate({prefix:"NOK"});
       nok.status = BaseStatus.Active;
     }
     else{
    //    nok = customer.NOK;
       nok.updatedAt = new Date();
     }
     
     if(nokInfo && Object.keys(nokInfo).length>0){
         nok.customerID= customer.id;
       nok.dateOfBirth = this._utilService.toDate(nokInfo.dob.day,nokInfo.dob.month,nokInfo.dob.year);
       nok.email = nokInfo.email;
       nok.otherNames =nokInfo.otherNames;
       nok.lastName = nokInfo.surname;
       nok.firstName = nokInfo.otherNames;
       nok.relationship = nokInfo.relationship as unknown as Relationship;
       nok.phoneNumber = nokInfo.phoneNumber;
       nok.title = nokInfo.title;
       nok.address = "";
     }
     customer.NOKID = nok.id;
     // save or update nok
     if(nok.id==0){
     let nokInDb = await this._nokRepository.create(nok);
     }else{
        let nokInDb = await this._nokRepository.update(nok);
     }
     //FOR PERSONAL INFO
     if(loanApplication.personalInfo){
         console.log("PERSONAL INFO")
     personalInfo = JSON.parse(loanApplication.personalInfo) as PersonalInfo;
       customer.updatedAt = new Date();
     if(personalInfo && Object.keys(personalInfo).length>0){
         
       customer.dateOfBirth =this._utilService.toDate(personalInfo.dob.day,personalInfo.dob.month ,personalInfo.dob.year);
       customer.email = personalInfo.email;
       customer.firstName =personalInfo.firstName;
       customer.lastName = personalInfo.surname;
       customer.otherNames =personalInfo.otherNames;
       customer.address = this._utilService.toAddress(personalInfo.address.street,personalInfo.address.city,personalInfo.address.state);
       customer.gender = personalInfo.gender as unknown as Gender;
       customer.phoneNumber = personalInfo.phoneNumber;
       customer.title = personalInfo.title;
       customer.maritalStatus = personalInfo.maritalStatus as unknown as MaritalStatus;
       if(!customer.BVN ) {
         if(!bvnInfo) throw "No BVN specified";
         customer.BVN = bvnInfo.bvn;
       }
     }
    }
    console.log("This is the customer",customer)
     const customerInDb = await this._customerRepository.update(customer);
     console.log(customerInDb)
     nok.customer = customer;
     //For EMPLOYMENT INFO
     console.log("EMPLOYMENT INFO")
     let employment:Employment;
     let employmentInDb:Employment;
     if(!loanApplication.employmentInfo) throw "Please provide employment details";
     employmentInfo = JSON.parse(loanApplication.employmentInfo) as EmploymentInfo;
     if(employmentInfo.id==0){ 
       if(!employmentInfo || Object.keys(employmentInfo).length==0) throw "Please provide your employment details";
       let e:Employment[]  = await  this._employmentRepository.getByCustomerID(customer.id)
       let emp:any[]=e.filter(c=>c.employer==employmentInfo.employer);
       employment = emp.length>0?Object.assign(emp[0].dataValues,new Employment()):new Employment();
       if(emp.length==0) {
         employment.id=0;
       employment.createdAt = new Date();
       employment.status = BaseStatus.Active;
       employment.code = this._utilService.autogenerate({prefix:"EMP"})
       }else{
        employment.updatedAt = new Date();
    }
      
     }
     else{
       let e:any = await this._employmentRepository.getById(employmentInfo.id);
       if(!e || Object.keys(e).length==0) throw "Invalid Employment Info";
      //  employment = e.dataValues as Employment;
     employment=  Object.assign(e.dataValues as Employment,new Employment());
       employment.updatedAt = new Date();
     }
     if(employmentInfo && Object.keys(employmentInfo).length>0){
       employment.email = employmentInfo.email;
       employment.employer =employmentInfo.employer;
       employment.street = employmentInfo.address.street;
       employment.city = employmentInfo.address.city;
       employment.state = employmentInfo.address.state;
       employment.address = this._utilService.toAddress(employmentInfo.address.street,employmentInfo.address.city,employmentInfo.address.state);
       employment.phoneNumber = employmentInfo.phoneNumber;
       employment.payDay = +employmentInfo.payDay;
       employment.netMonthlySalary =employmentInfo.netMonthlySalary;
       employment.businessSector = employmentInfo.businessSector;
 
     }
     employment.customerID = customer.id;
     //save or update employment
     if(employment.id==0){
         employmentInDb =await  this._employmentRepository.create(employment);
        }else{
            employmentInDb =await  this._employmentRepository.update(employment);
            employmentInDb = employment;
        }
        console.log(employmentInDb)
        employment.id = employmentInDb.id;
     loanTypeRequirements.employment = employment;
     loanTypeRequirements.employmentID = employmentInDb.id;
     loanTypeRequirements.nok = nok;
     loanTypeRequirements.code = this._utilService.autogenerate({prefix:"LTR"});
     loanTypeRequirements.createdAt = new Date();
     loanTypeRequirements.status = BaseStatus.Active;
 
   }
 
   if(category=="business"){
       //For COMPANY
       
       let company:Company;
       let companyInDb:Company;
       if(!loanApplication.companyInfo) throw "Please provide company details";
       companyInfo = JSON.parse(loanApplication.companyInfo) as CompanyInfo;
       if(companyInfo.id==0){ 
         if(!companyInfo || Object.keys(companyInfo).length==0) throw "Please provide your Company details";
         let e:Company[]  = await  this._companyRepository.getByCustomerID(customer.id)
          let comp:any[] = e.filter(c=>c.name==companyInfo.companyName);
         company = comp.length>0?Object.assign(comp[0].dataValues,new Employment()):new Company();
         if(comp.length==0) {
          company.id=0;
         company.createdAt = new Date();
         company.status = BaseStatus.Active; }else{
          company.updatedAt = new Date();
      }

       }
       else{
        let e:any = await this._companyRepository.getById(companyInfo.id);
        if(!e || Object.keys(e).length==0) throw "Invalid Company Info";
        // company = e.dataValues as Company;
       company = Object.assign(e.dataValues as Company,new Company());
         company.updatedAt = new Date();
       }
       
       if(companyInfo && Object.keys(companyInfo).length>0){
         company.dateOfIncorporation = this._utilService.toDate(companyInfo.dateOfIncorporation.day,companyInfo.dateOfIncorporation.month,companyInfo.dateOfIncorporation.year);
         company.email = companyInfo.email;
         company.natureOfBusiness =companyInfo.natureOfBusiness;
         company.name = companyInfo.companyName;
         company.rcNo = companyInfo.companyRCNo;
         company.street = companyInfo.address.street;
         company.city = companyInfo.address.city;
         company.state = companyInfo.address.state;
         company.address = this._utilService.toAddress( companyInfo.address.street, companyInfo.address.city, companyInfo.address.state);
         company.timeInBusiness = companyInfo.timeInBusiness
         company.phoneNumber = companyInfo.phoneNumber;
       }
       company.customerID = customer.id;
       //save or update company info
       if(company.id==0){
         companyInDb = await this._companyRepository.create(company);
        }else{
            companyInDb =await  this._companyRepository.update(company);
        }
        company.id = companyInDb.id;
       //For SHAREHOLDER
       let shareholders:Shareholder[]=[];
       if(!loanApplication.shareholderInfo) throw "Please provide shareholder details";
       shareholderInfos = JSON.parse(loanApplication.shareholderInfo) as ShareholderInfo[];
       if(!shareholderInfos || shareholderInfos.length==0) throw "Please provide your Shareholders";
       shareholderInfos.forEach(async shareholderInfo=>{
         let shareholder:Shareholder;
         let shareholderInDb:Shareholder;
       if(shareholderInfo.id==0){ 
         if(!shareholderInfo || Object.keys(shareholderInfo).length==0) throw "Please provide Shareholder details";
         shareholder = new Shareholder();
         shareholder.createdAt = new Date();
         shareholder.status = BaseStatus.Active;
       }
       else{
        let e:any = await this._shareholderRepository.getById(shareholderInfo.id);
        if(!e || Object.keys(e).length==0) throw "Invalid Shareholder Info";
        // shareholder = e.dataValues as Shareholder;
       shareholder= Object.assign(e.dataValues as Shareholder,new Shareholder());
        shareholder.updatedAt = new Date();
       }
       
       if(shareholderInfo && Object.keys(shareholderInfo).length>0){
           
         shareholder.dateOfBirth = this._utilService.toDate(shareholderInfo.dob.day,shareholderInfo.dob.month,shareholderInfo.dob.year);
         shareholder.email = shareholderInfo.email;
         shareholder.designation =shareholderInfo.designation;
         shareholder.otherNames = shareholderInfo.otherNames;
         shareholder.surname = shareholderInfo.surname;
         shareholder.street = shareholderInfo.address.street;
         shareholder.city = shareholderInfo.address.city;
         shareholder.state = shareholderInfo.address.state;
         shareholder.address = this._utilService.toAddress(shareholderInfo.address.street,shareholderInfo.address.city,shareholderInfo.address.state);
         shareholder.educationalQualifications = shareholderInfo.educationalQualification;
         shareholder.phoneNumber = shareholderInfo.phoneNumber;
         shareholder.maritalStatus = shareholderInfo.maritalStatus as unknown as MaritalStatus;
         shareholder.gender = shareholderInfo.gender as unknown as Gender;
       }
       shareholder.companyID = company.id;
       //save or update shareholder info
       if(shareholder.id==0){
         shareholderInDb =await  this._shareholderRepository.create(shareholder);
        }else{
            shareholderInDb =await  this._shareholderRepository.update(shareholder);
        }
        shareholder.id = shareholderInDb.id;
       shareholders.push(shareholder);
     });
     
     let collateral:Collateral;
     let collateralInDb:Collateral;
     if(!loanApplication.collateralInfo) throw "Please provide collateral details";
       collateralInfo = JSON.parse(loanApplication.collateralInfo) as CollateralInfo;
       if(collateralInfo.id==0){ 
         if(!collateralInfo || Object.keys(collateralInfo).length==0) throw "Please provide your Collateral details";
         collateral = new Collateral();
         collateral.createdAt = new Date();
         collateral.status = BaseStatus.Active;
       }
       else{
        let e:any = await this._collateralRepository.getById(collateralInfo.id);
        if(!e || Object.keys(e).length==0) throw "Invalid Collateral Info";
        // collateral = e.dataValues as Collateral;
        collateral = Object.assign(e.dataValues as Collateral,new Collateral());
         collateral.updatedAt = new Date();
       }
       
       if(collateralInfo && Object.keys(collateralInfo).length>0){
         collateral.description = collateralInfo.description;
         collateral.owner =collateralInfo.owner;
         collateral.type = collateralInfo.type;
         collateral.valuation = this._utilService.convertToPlainNumber(collateralInfo.valuation);
         let documentInfo  = collateralInfo.document;
         if(documentInfo.id>0){
           let document =  new Document(); //get document from db;
           collateral.document = document;
           collateral.documentID = document.id; 
         }
       }
       collateral.customerID = customer.id;
       //save or update collateral info
       if(collateral.id==0){
         collateralInDb = await this._collateralRepository.create(collateral);
        }else{
            collateralInDb = await this._collateralRepository.update(collateral);
        }
        collateral.id = collateralInDb.id;
     loanTypeRequirements.company = company;
     loanTypeRequirements.companyID = companyInDb.id;
     loanTypeRequirements.shareholders = shareholders;
     loanTypeRequirements.shareholderIDs = shareholders.reduce(function(a, b) {return a + ["", ", "][+!!a.length] + b.id;}, "");
     loanTypeRequirements.collateral = collateral;
     loanTypeRequirements.collateralID = collateralInDb.id;
 
   }
 
   resolve(loanTypeRequirements);
}catch(err){
reject(err)
}
 });

 }