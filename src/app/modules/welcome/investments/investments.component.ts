import { style } from '@angular/animations';
import { ChangeDetectionStrategy } from '@angular/core';
import { Component, Input, OnInit, Output } from '@angular/core';
import { ElementSize, ElementStyle, ElementState, ValidationType } from 'src/shared/constants/enum';
import { AssetPath, ButtonOptions, InputOptions, ValidationOption, ValidationOptions } from 'src/shared/constants/variables';
import { APIHelper } from 'src/shared/helpers/api';
import { Utility } from 'src/shared/helpers/utility';
import { IAssetPath } from 'src/shared/interfaces/assetpath';
import { InvestmentIndication, RateDetail } from './investment';

@Component({
  selector: 'app-investments',
  templateUrl: './investments.component.html',
  styleUrls: ['./investments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvestmentsComponent implements OnInit {

  utility = new Utility();
  //Amount Input Config
  amountValOpt:ValidationOptions =new ValidationOptions([new ValidationOption(ValidationType.currency),new ValidationOption(ValidationType.custom,"Minimum Amount is 250000")]);
  amountOptions: InputOptions =new InputOptions("How much are you looking to invest?","250,000","widget_input--sm theme_text--alt","amount","text","amount","Enter amount","small",this.amountValOpt,{min:"250000",max:"50000000"})
  
  //Name Input Config
  nameValOpt:ValidationOptions =new ValidationOptions([new ValidationOption(ValidationType.name)]);
  nameOptions: InputOptions =new InputOptions("Preferred Name","","widget_input--sm","preferred-name","text","preferred-name","Enter Preferred Name","small",this.nameValOpt)
  
  //Email Input Config
  emailValOpt:ValidationOptions =new ValidationOptions([new ValidationOption(ValidationType.email)]);
  emailOptions: InputOptions =new InputOptions("Email Address","","widget_input--sm","email","text","email","Enter your email address","small",this.emailValOpt)
  

  buttonOptions:ButtonOptions= new ButtonOptions("I Am Interested",ElementStyle.default,"",ElementSize.default,true,ElementState.default);
  
  assetPaths:IAssetPath = new AssetPath;
  mobile:string = "sm-mobile";
  desktop:string="sm-desktop";
  headerclass:string ="header";
  showModal:boolean=false;
  modalType:string = 'investment-indication';
  rateDetail:RateDetail;

  amount:number = 250000;
  emailAddress:string;
  name:string;

  constructor() { }

  ngOnInit(): void {
  }

  printValue(key:string,value:any):void{
    // console.log("Printing Value",value)
    switch(key){
      case 'amount':
        this.amount = this.utility.convertToPlainNumber(value);
        
        break;
      case 'name':
        this.name = value;
        break;
      case 'email':
        this.emailAddress = value;
        break;
      default:
        break;
    }
  }
rateDetailChange(value:any){
  // console.log("Rate Detail", value);
  this.rateDetail =  value;
}
  submit(event:any){
    // console.log(event)
    event.preventDefault();
    let form:InvestmentIndication= new InvestmentIndication;
    // this.showModal=true;
    form.amount = this.amount;
    form.duration = this.rateDetail.duration;
    form.maturity = this.rateDetail.maturity;
    form.rate= this.rateDetail.rate;
    form.payout= this.rateDetail.payout;
    form.emailAddress =this.emailAddress;
    form.preferredName = this.name;
    // console.log(form)
    const payload = {email:form.emailAddress, payload:{amount : form.amount, duration:form.duration, payout:form.payout, name:form.preferredName,rate:form.rate, maturity: form.maturity}};
      new APIHelper().post("sendinvestment", payload,undefined).then(res=>{
        console.log("Investment",res)
        this.showModal=true;
      }).catch(err=>{console.log(err);this.showModal=true;});
    
  }

   

}

