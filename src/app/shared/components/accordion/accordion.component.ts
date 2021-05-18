import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-accordion',
  template: `
  <div class="accordion accordion_{{headerClass}}" #el (click)="toggleHelper()" >
                        <slot name="header">Default Title</slot>
                    </div>
  <div class="panel"><div class="content"><slot name="panel">Default Panel</slot></div></div>
  `,
  styleUrls: ['./accordion.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class AccordionComponent implements OnInit {
  @ViewChild("el", {read: ElementRef}) el: ElementRef;
  @Input() headerClass: string ;
  @Input() panelClass:string;
  constructor() { }

  ngOnInit(): void {
  }
  toggleHelper() {
    this.el.nativeElement.classList.toggle("active");
    var panel = this.el.nativeElement.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight +700+ "px";
  }
}
}
