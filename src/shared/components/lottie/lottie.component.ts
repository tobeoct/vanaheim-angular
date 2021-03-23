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
 options: AnimationOptions={
  path: `../../assets/animations/${this.assetPath}.json`
}
  constructor() { }

  ngOnInit(): void {
    this.options = {
      path: `../../assets/animations/${this.assetPath}.json`
    }
  }

  ngOnChanges():void{
   
  }

  animationCreated(animationItem: AnimationItem): void {
    // console.log(animationItem);
  }
}
