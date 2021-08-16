import { Routes } from "@angular/router";
import { AdditionalInfoComponent } from "src/app/modules/loan/business/additional-info/additional-info.component";
import { CollateralInfoComponent } from "src/app/modules/loan/business/collateral-info/collateral-info.component";
import { CompanyInfoComponent } from "src/app/modules/loan/business/company-info/company-info.component";
import { ShareholderInfoComponent } from "src/app/modules/loan/business/shareholder-info/shareholder-info.component";
import { BVNComponent } from "src/app/modules/loan/personal/bvn/bvn.component";
import { EmploymentInfoComponent } from "src/app/modules/loan/personal/employment-info/employment-info.component";
import { NOKInfoComponent } from "src/app/modules/loan/personal/nok-info/nok-info.component";
import { PersonalInfoComponent } from "src/app/modules/loan/personal/personal-info/personal-info.component";
import { PathGuard } from "../guards/loan/path.guard";

export const personalRoutes:Routes = [
    {path:"bvn-info", component:BVNComponent,canActivate:[PathGuard]},
    {path:"personal-info", component:PersonalInfoComponent,canActivate:[PathGuard]},
    {path:"employment-info", component:EmploymentInfoComponent,canActivate:[PathGuard]},
    {path:"nok-info", component:NOKInfoComponent,canActivate:[PathGuard]}];
    export const businessRoutes:Routes=[
  {path:"company-info", component:CompanyInfoComponent,canActivate:[PathGuard]},
  {path:"shareholder-info", component:ShareholderInfoComponent,canActivate:[PathGuard]},
  {path:"collateral-info", component:CollateralInfoComponent,canActivate:[PathGuard]},
  {path:"contact-info", component:AdditionalInfoComponent,canActivate:[PathGuard]}
    ];