import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
 
@Component({
  selector: 'app-lottie',
  templateUrl: './lottie.component.html',
  styleUrls: ['./lottie.component.scss']
})
export class LottieComponent implements OnInit, OnChanges {
 @Input() assetPath:string = "";
 path:string;
 base:string = "../../../assets/animations"
 options: AnimationOptions={
  path: `${this.base}/${this.assetPath}.json`
}
  constructor() { }

  ngOnInit(): void {
    this.options = {
      path: `${this.base}/${this.assetPath}.json`
    }

    this.path = `${this.base}/${this.assetPath}.json`;
  }

  ngOnChanges():void{
    this.options = {
      path: `${this.base}/${this.assetPath}.json`
    }

    this.path = `${this.base}/${this.assetPath}.json`;
  }

  animationCreated(animationItem: AnimationItem): void {
    // console.log(animationItem);
  }
}
