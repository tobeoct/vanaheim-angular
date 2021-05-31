import { Component, Input, OnInit } from '@angular/core';
import { AssetPath } from 'src/app/shared/constants/variables';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalOldComponent implements OnInit {

  @Input() show:boolean = false;
  @Input() type:string = 'investment-indication';
  assetPaths:AssetPath = new AssetPath;
  constructor() { }

  ngOnInit(): void {
  }
close(){
  this.show=false;
}
}
