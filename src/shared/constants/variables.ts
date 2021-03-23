import { style } from '@angular/animations';
import {IAssetPath} from "../../shared/interfaces/assetpath";
import { ElementSize, ElementStyle, ElementState, ValidationType } from './enum';
export class AssetPath implements IAssetPath {
    
loan:string = "vanir-capital-loans";
investment:string = "vanir-capital-investment-2";
badge:string = "vanir-capital-badge";
}

export class InputOptions{
    constructor(label:string,value:string,myClass:string,id:string,type:string,name:string,placeholder:string,size:string,validationOptions: ValidationOptions,range:any = undefined){
        this.type = type;
        this.myClass=myClass
        this.id=id
        this.type=type
        this.name=name
        this.value=value
        if(range){
            this.min=range.min
            this.max=range.max
        }
        this.placeholder=placeholder
        this.label=label
        this.size=size
        this.validationOptions= validationOptions
    }
    myClass:string="widget_input" 
    id:string="input"
    type:string="text"
    name:string="input"
    value:string=""
    min:string=""
    max:string=""
    placeholder:string="Enter Input"
    label:string=""
    size:string="small"
    validationOptions: ValidationOptions
}

export class ButtonOptions{
    constructor(text:string,type:ElementStyle,myClass:string,size:ElementSize,isSubmit:boolean,state: ElementState){
        this.text = text;
        this.type =type;
        this.myClass =myClass;
        this.size = size;
        this.isSubmit = isSubmit;
        this.state = state;
    }
    text:string="Button"
    type:ElementStyle=ElementStyle.default
    myClass:string=""
    size:ElementSize = ElementSize.default
    isSubmit:boolean = true
    state: ElementState =  ElementState.default
}

export class ValidationResponse{
    value:any
    isValid:boolean
}

export class ValidationOptions{
    constructor(options:ValidationOption[]){
        this.options = options;
    }
    options:ValidationOption[]
}
export class ValidationOption{

    constructor(type:ValidationType,message:string='',pattern:string='',name:string=''){
        this.type = type;
        this.message =message;
        this.pattern = pattern;
    }
    type:ValidationType = ValidationType.text
    message:string
    pattern:string 
    name:string
}
