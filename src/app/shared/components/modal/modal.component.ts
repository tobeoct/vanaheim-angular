import { Component, Input, OnInit } from '@angular/core';
import { ElementSize, ElementStyle, ElementState } from 'src/app/shared/constants/enum';
import { AssetPath, ButtonOptions } from 'src/app/shared/constants/variables';
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
