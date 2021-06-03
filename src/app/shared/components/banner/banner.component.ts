import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  @Input() show = true;
  @Input() color="tertiary";
  @Input() class:string;
  constructor() { }

  ngOnInit(): void {
  }
  

}
