import { Component, Input, OnInit } from '@angular/core';
import { ElementSize, ElementStyle, ElementState, ValidationType } from 'src/shared/constants/enum';
import { AssetPath, ButtonOptions, InputOptions, ValidationOption, ValidationOptions } from 'src/shared/constants/variables';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() show:boolean = false;
  @Input() type:string = 'investment-indication';
  assetPaths:AssetPath = new AssetPath;
  buttonOptions:ButtonOptions= new ButtonOptions("Continue",ElementStyle.default,"",ElementSize.default,true,ElementState.default);
  constructor() { }

  ngOnInit(): void {
  }
close(){
  this.show=false;
}
}
