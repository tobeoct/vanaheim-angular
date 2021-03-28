import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[focus]'
})
  export class FocusDirective implements OnInit {
  
    @Input('focus') isFocused: boolean|null;
  
    constructor(private hostElement: ElementRef) {
    }
  
    ngOnInit() {
      console.log("Init",this.isFocused)
      if (this.isFocused) {
        this.hostElement.nativeElement.focus();
      }
    }
    ngAfterViewInit(): void {
      console.log("After View Init",this.isFocused)
      if (this.isFocused) {
        this.hostElement.nativeElement.focus();
      }
    }
    ngOnChanges(): void {
      console.log("On Changes",this.isFocused)
      if (this.isFocused) {
        
      console.log("On Changes",this.hostElement.nativeElement)
        this.hostElement.nativeElement.focus();
      }
    }
  }
  
