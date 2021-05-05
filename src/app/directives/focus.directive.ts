import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[focus]'
})
  export class FocusDirective implements OnInit {
  
    @Input('focus') isFocused: boolean|null;
  
    constructor(private hostElement: ElementRef) {
    }
  
    ngOnInit() {
      if (this.isFocused) {
        this.hostElement.nativeElement.focus();
      }
    }
    ngAfterViewInit(): void {
      if (this.isFocused) {
        this.hostElement.nativeElement.focus();
      }
    }
    ngOnChanges(): void {
      if (this.isFocused) {
        
        this.hostElement.nativeElement.focus();
      }
    }
  }
  
