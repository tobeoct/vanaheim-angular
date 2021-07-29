import { Collateral } from "@models/collateral";
import { Company } from "@models/company";
import { Customer } from "@models/customer";
import { Document } from "@models/document";
import { Employment } from "@models/employment";
import { Gender } from "@models/helpers/enums/gender";
import { MaritalStatus } from "@models/helpers/enums/maritalstatus";
import { Relationship } from "@models/helpers/enums/relationship";
import { BaseStatus } from "@models/helpers/enums/status";
import { LoanTypeRequirements } from "@models/loan/loan-type-requirements";
import { NOK } from "@models/nok";
import { Shareholder } from "@models/shareholder";
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
import { ILoanTypeRequirementService } from "@services/interfaces/loan/Iloan-type-requirement-service";
import { CollateralInfo } from "src/app/modules/loan/business/collateral-info/collateral-info";
import { CompanyInfo } from "src/app/modules/loan/business/company-info/company-info";
import { ShareholderInfo } from "src/app/modules/loan/business/shareholder-info/shareholder-info";
import { BVN } from "src/app/modules/loan/personal/bvn/bvn";
import { EmploymentInfo } from "src/app/modules/loan/personal/employment-info/employment-info";
import { NOKInfo } from "src/app/modules/loan/personal/nok-info/nok-info";
import { PersonalInfo } from "src/app/modules/loan/personal/personal-info/personal-info";
import UtilService from "../common/util";

export class LoanTypeRequirementService implements ILoanTypeRequirementService {
  constructor(private _customerRepository: ICustomerRepository, private _accountRepository: IAccountRepository, private _nokRepository: INOKRepository, private _companyRepository: ICompanyRepository, private _shareholderRepository: IShareholderRepository, private _collateralRepository: ICollateralRepository, private _employmentRepository: IEmploymentRepository, private _loanTypeRequirementRepository: ILoanTypeRequirementRepository, private _utilService: UtilService, _loanRequestRepository: ILoanRequestRepository) {

  }
  search: (parameters: any, customer?: any) => Promise<any>;
  getByIdExtended = (id: number) => new Promise<any>(async (resolve, reject) => {
    try {
      let requirement = new LoanTypeRequirements();

      let req = await this._loanTypeRequirementRepository.getById(id);
      Object.assign(requirement, req?.dataValues);

      if (requirement.collateralID) {
        requirement.collateral = await this._collateralRepository.getById(requirement.collateralID);
      }

      if (requirement.companyID) {
        requirement.company = await this._companyRepository.getById(requirement.companyID);
      }
      if (requirement.employmentID) {
        requirement.employment = await this._employmentRepository.getById(requirement.employmentID);
      }

      if (requirement.shareholderIDs) {
        requirement.shareholders = [];
        await new Promise((resolve, reject) => requirement.shareholderIDs.split(",").forEach(async (s, i) => {
          let shareholder = await this._shareholderRepository.getById(+s);
          requirement.shareholders.push(shareholder);
          if (i == (s.split(",").length - 1)) resolve(s);
        }))
      }
      resolve(requirement);
    } catch (err) {
      reject(err);
    }
  })
  getAll: () => Promise<LoanTypeRequirements[]>;
  getById: (id: number) => Promise<LoanTypeRequirements>;
  getByIdWithInclude: (id: number, include?: any[] | undefined) => Promise<LoanTypeRequirements>;
  update: (data: LoanTypeRequirements) => Promise<LoanTypeRequirements>;
  create: (data: LoanTypeRequirements) => Promise<LoanTypeRequirements>;
  delete: (id: number) => Promise<LoanTypeRequirements>;
  enable: (id: number) => Promise<LoanTypeRequirements>;
  disable: (id: number) => Promise<LoanTypeRequirements>;
  convertToModel: (modelInDb: any) => Promise<LoanTypeRequirements>;


  createLoanRequirement = (loanApplication: any, category: string, customer: Customer) => new Promise<any>(async (resolve, reject) => {
    try {
      let loanTypeRequirements = new LoanTypeRequirements();
      let companyInfo: CompanyInfo;
      let shareholderInfos: ShareholderInfo[];
      let collateralInfo: CollateralInfo;

      let employmentInfo: EmploymentInfo;
      let personalInfo: PersonalInfo;
      let nokInfo: NOKInfo;
      let bvnInfo: BVN;
      // let c = customer.dataValues as Customer;
      if (category == "personal") {
        bvnInfo = JSON.parse(loanApplication.bvn) as BVN;
        if (!bvnInfo.tc || !bvnInfo.privacy) throw "Terms have not been accepted. Kindly accept";

        //For NOK
        let nok: NOK;
        let n: any = await this._nokRepository.getByCustomerID(customer.id);
        console.log(n)
        if (!n || Object.keys(n).length == 0) {
          nok = new NOK();
          nok.id = 0;
        } else {
          //  nok = n.dataValues as NOK;
          nok = Object.assign(n.dataValues as NOK, new NOK());
        }
        if (!loanApplication.nokInfo) throw "Please provide next of kin details";
        nokInfo = JSON.parse(loanApplication.nokInfo) as NOKInfo;
        if (!nok || nok.id == 0) {
          if (!nokInfo || Object.keys(nokInfo).length == 0) throw "Please provide your Next Of Kin details";

          nok.createdAt = new Date();
          nok.code = this._utilService.autogenerate({ prefix: "NOK" });
          nok.status = BaseStatus.Active;
        }
        else {
          //    nok = customer.NOK;
          nok.updatedAt = new Date();
        }

        if (nokInfo && Object.keys(nokInfo).length > 0) {
          nok.customerID = customer.id;
          nok.dateOfBirth = this._utilService.toDate(nokInfo.dob.day, nokInfo.dob.month, nokInfo.dob.year);
          nok.email = nokInfo.email;
          nok.otherNames = nokInfo.otherNames;
          nok.lastName = nokInfo.surname;
          nok.firstName = nokInfo.otherNames;
          nok.relationship = nokInfo.relationship as unknown as Relationship;
          nok.phoneNumber = nokInfo.phoneNumber;
          nok.title = nokInfo.title;
          nok.address = "";
        }
        customer.NOKID = nok.id;
        // save or update nok
        if (nok.id == 0) {
          let nokInDb = await this._nokRepository.create(nok);
        } else {
          let nokInDb = await this._nokRepository.update(nok);
        }
        //FOR PERSONAL INFO
        if (loanApplication.personalInfo) {
          console.log("PERSONAL INFO")
          personalInfo = JSON.parse(loanApplication.personalInfo) as PersonalInfo;
          customer.updatedAt = new Date();
          if (personalInfo && Object.keys(personalInfo).length > 0) {

            customer.dateOfBirth = this._utilService.toDate(personalInfo.dob.day, personalInfo.dob.month, personalInfo.dob.year);
            customer.email = personalInfo.email;
            customer.firstName = personalInfo.firstName;
            customer.lastName = personalInfo.surname;
            customer.otherNames = personalInfo.otherNames;
            customer.address = this._utilService.toAddress(personalInfo.address.street, personalInfo.address.city, personalInfo.address.state);
            customer.gender = personalInfo.gender as unknown as Gender;
            customer.phoneNumber = personalInfo.phoneNumber;
            customer.title = personalInfo.title;
            customer.maritalStatus = personalInfo.maritalStatus as unknown as MaritalStatus;
            if (!customer.BVN) {
              if (!bvnInfo) throw "No BVN specified";
              customer.BVN = bvnInfo.bvn;
            }
          }
        }
        console.log("This is the customer", customer)
        const customerInDb = await this._customerRepository.update(customer);
        console.log(customerInDb)
        nok.customer = customer;
        //For EMPLOYMENT INFO
        console.log("EMPLOYMENT INFO")
        let employment: Employment;
        let employmentInDb: Employment;
        if (!loanApplication.employmentInfo) throw "Please provide employment details";
        employmentInfo = JSON.parse(loanApplication.employmentInfo) as EmploymentInfo;
        if (employmentInfo.id == 0) {
          if (!employmentInfo || Object.keys(employmentInfo).length == 0) throw "Please provide your employment details";
          let e: Employment[] = await this._employmentRepository.getByCustomerID(customer.id)
          let emp: any[] = e.filter(c => c.employer == employmentInfo.employer);
          employment = emp.length > 0 ? Object.assign(emp[0].dataValues, new Employment()) : new Employment();
          if (emp.length == 0) {
            employment.id = 0;
            employment.createdAt = new Date();
            employment.status = BaseStatus.Active;
            employment.code = this._utilService.autogenerate({ prefix: "EMP" })
          } else {
            employment.updatedAt = new Date();
          }

        }
        else {
          let e: any = await this._employmentRepository.getById(employmentInfo.id);
          if (!e || Object.keys(e).length == 0) throw "Invalid Employment Info";
          //  employment = e.dataValues as Employment;
          employment = Object.assign(e.dataValues as Employment, new Employment());
          employment.updatedAt = new Date();
        }
        if (employmentInfo && Object.keys(employmentInfo).length > 0) {
          employment.email = employmentInfo.email;
          employment.employer = employmentInfo.employer;
          employment.street = employmentInfo.address.street;
          employment.city = employmentInfo.address.city;
          employment.state = employmentInfo.address.state;
          employment.address = this._utilService.toAddress(employmentInfo.address.street, employmentInfo.address.city, employmentInfo.address.state);
          employment.phoneNumber = employmentInfo.phoneNumber;
          employment.payDay = +employmentInfo.payDay;
          employment.netMonthlySalary = employmentInfo.netMonthlySalary;
          employment.businessSector = employmentInfo.businessSector;

        }
        employment.customerID = customer.id;
        //save or update employment
        if (employment.id == 0) {
          employmentInDb = await this._employmentRepository.create(employment);
        } else {
          employmentInDb = await this._employmentRepository.update(employment);
          employmentInDb = employment;
        }
        console.log(employmentInDb)
        employment.id = employmentInDb.id;
        loanTypeRequirements.employment = employment;
        loanTypeRequirements.employmentID = employmentInDb.id;
        loanTypeRequirements.nok = nok;
        loanTypeRequirements.code = this._utilService.autogenerate({ prefix: "LTR" });
        loanTypeRequirements.createdAt = new Date();
        loanTypeRequirements.status = BaseStatus.Active;

      }

      if (category == "business") {
        //For COMPANY

        let company: Company;
        let companyInDb: Company;
        if (!loanApplication.companyInfo) throw "Please provide company details";
        companyInfo = JSON.parse(loanApplication.companyInfo) as CompanyInfo;
        if (companyInfo.id == 0) {
          if (!companyInfo || Object.keys(companyInfo).length == 0) throw "Please provide your Company details";
          let e: Company[] = await this._companyRepository.getByCustomerID(customer.id)
          let comp: any[] = e.filter(c => c.name == companyInfo.companyName);
          company = comp.length > 0 ? Object.assign(comp[0].dataValues, new Employment()) : new Company();
          if (comp.length == 0) {
            company.id = 0;
            company.createdAt = new Date();
            company.status = BaseStatus.Active;
            company.code = this._utilService.autogenerate({ prefix: "Company" });
          }
          else {
            company.updatedAt = new Date();
          }

        }
        else {
          let e: any = await this._companyRepository.getById(companyInfo.id);
          if (!e || Object.keys(e).length == 0) throw "Invalid Company Info";
          // company = e.dataValues as Company;
          company = Object.assign(e.dataValues as Company, new Company());
          company.updatedAt = new Date();
        }

        if (companyInfo && Object.keys(companyInfo).length > 0) {
          company.dateOfIncorporation = this._utilService.toDate(companyInfo.dateOfIncorporation.day, companyInfo.dateOfIncorporation.month, companyInfo.dateOfIncorporation.year);
          company.email = companyInfo.email;
          company.natureOfBusiness = companyInfo.natureOfBusiness;
          company.name = companyInfo.companyName;
          company.rcNo = companyInfo.companyRCNo;
          company.street = companyInfo.address.street;
          company.city = companyInfo.address.city;
          company.state = companyInfo.address.state;
          company.address = this._utilService.toAddress(companyInfo.address.street, companyInfo.address.city, companyInfo.address.state);
          company.timeInBusiness = companyInfo.timeInBusiness
          company.phoneNumber = companyInfo.phoneNumber;
        }
        company.customerID = customer.id;
        //save or update company info
        if (company.id == 0) {
          companyInDb = await this._companyRepository.create(company);
        } else {
          companyInDb = await this._companyRepository.update(company);
          companyInDb = company;
        } 6
        company.id = companyInDb.id;
        //For SHAREHOLDER
        let shareholders: Shareholder[] = this.createShareholders(loanApplication, company);

        let collateral: Collateral = await this.createCollateral(loanApplication, customer);
        loanTypeRequirements.company = company;
        loanTypeRequirements.companyID = companyInDb.id;
        loanTypeRequirements.shareholders = shareholders;
        loanTypeRequirements.shareholderIDs = shareholders.reduce(function (a, b) { return a + ["", ", "][+!!a.length] + b.id; }, "");
        loanTypeRequirements.collateral = collateral;
        loanTypeRequirements.collateralID = collateral.id;

      }

      resolve(loanTypeRequirements);
    } catch (err) {
      reject(err)
    }
  });

  createCollateral = async (loanApplication: any, customer: any) => {
    let collateralInfo: CollateralInfo;
    let collateral: Collateral;
    let collateralInDb: Collateral;
    if (!loanApplication.collateralInfo) throw "Please provide collateral details";
    collateralInfo = JSON.parse(loanApplication.collateralInfo) as CollateralInfo;
    if (collateralInfo.id == 0) {
      if (!collateralInfo || Object.keys(collateralInfo).length == 0) throw "Please provide your Collateral details";
      collateral = new Collateral();
      collateral.id = 0;
      collateral.createdAt = new Date();
      collateral.status = BaseStatus.Active;
      collateral.code = this._utilService.autogenerate({ prefix: "COLLAT" });
    }
    else {
      let e: any = await this._collateralRepository.getById(collateralInfo.id);
      if (!e || Object.keys(e).length == 0) throw "Invalid Collateral Info";
      // collateral = e.dataValues as Collateral;
      collateral = Object.assign(e.dataValues as Collateral, new Collateral());
      collateral.updatedAt = new Date();
    }

    if (collateralInfo && Object.keys(collateralInfo).length > 0) {
      collateral.description = collateralInfo.description;
      collateral.owner = collateralInfo.owner;
      collateral.type = collateralInfo.type;
      collateral.valuation = this._utilService.convertToPlainNumber(collateralInfo.valuation);
      let documentInfo = collateralInfo.document;
      if (documentInfo.id > 0) {
        let document = new Document(); //get document from db;
        collateral.document = document;
        collateral.documentID = document.id;
      }
    }
    collateral.customerID = customer.id;
    //save or update collateral info
    if (collateral.id == 0) {
      collateralInDb = await this._collateralRepository.create(collateral);
    } else {
      collateralInDb = await this._collateralRepository.update(collateral);
      collateralInDb = collateral;
    }
    collateral.id = collateralInDb.id;
    return collateral;
  }
  createShareholders(loanApplication: any, company: any) {
    //For SHAREHOLDER
    let shareholders: Shareholder[] = [];
    if (!loanApplication.shareholderInfo) throw "Please provide shareholder details";
    let shareholderInfos = JSON.parse(loanApplication.shareholderInfo) as ShareholderInfo[];
    if (!shareholderInfos || shareholderInfos.length == 0) throw "Please provide your Shareholders";
    shareholderInfos.forEach(async shareholderInfo => {
      console.log("SHAREHOLDER INFO", shareholderInfo);
      let shareholder: Shareholder;
      let shareholderInDb: Shareholder;
      if (shareholderInfo.id == 0) {
        if (!shareholderInfo || Object.keys(shareholderInfo).length == 0) throw "Please provide Shareholder details";
        shareholder = new Shareholder();
        shareholder.id = 0;
        shareholder.createdAt = new Date();
        shareholder.status = BaseStatus.Active;
        shareholder.code = this._utilService.autogenerate({ prefix: "SHLDR" });
      }
      else {
        let e: any = await this._shareholderRepository.getById(shareholderInfo.id);
        if (!e || Object.keys(e).length == 0) throw "Invalid Shareholder Info";
        // shareholder = e.dataValues as Shareholder;
        shareholder = Object.assign(e.dataValues as Shareholder, new Shareholder());
        shareholder.updatedAt = new Date();
      }

      if (shareholderInfo && Object.keys(shareholderInfo).length > 0) {
        shareholder.title = shareholderInfo.title;
        shareholder.dateOfBirth = this._utilService.toDate(shareholderInfo.dob.day, shareholderInfo.dob.month, shareholderInfo.dob.year);
        shareholder.email = shareholderInfo.email;
        shareholder.designation = shareholderInfo.designation;
        shareholder.otherNames = shareholderInfo.otherNames;
        shareholder.surname = shareholderInfo.surname;
        shareholder.street = shareholderInfo.address.street;
        shareholder.city = shareholderInfo.address.city;
        shareholder.state = shareholderInfo.address.state;
        shareholder.address = this._utilService.toAddress(shareholderInfo.address.street, shareholderInfo.address.city, shareholderInfo.address.state);
        shareholder.educationalQualification = shareholderInfo.educationalQualification;
        shareholder.phoneNumber = shareholderInfo.phoneNumber;
        shareholder.relationship = "";
        shareholder.maritalStatus = shareholderInfo.maritalStatus as unknown as MaritalStatus;
        shareholder.gender = shareholderInfo.gender as unknown as Gender;
      }
      shareholder.companyID = company.id;
      //save or update shareholder info
      if (shareholder.id == 0) {
        shareholderInDb = await this._shareholderRepository.create(shareholder);
      } else {
        shareholderInDb = await this._shareholderRepository.update(shareholder);
        shareholderInDb = shareholder;
      }
      shareholder.id = shareholderInDb.id;
      shareholders.push(shareholder);
    });

    return shareholders;
  }

}