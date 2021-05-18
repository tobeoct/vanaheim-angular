import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit, AfterViewInit {

  @ViewChild("rangeV")
  private rangeV: ElementRef;
  @ViewChild("range")
  private range: ElementRef;
  @Input()
  min:number=1;
  @Input()
  max:number=12;
  denominator:string = "Mos";
  @Input()
  control:FormControl;

  @Input() type:string = "text";
  @Input() value:string;
  @Input() fieldClass:string;
  @Input() label:string;
  @Input() error:string;
  @Input() class:string;
  @Input() required:boolean=false;
  @Input() id:string;
  @Input() step:number =1;
  @Input() errorType:string = "default";
  @Input() focus$:Observable<boolean>;
  @Input() denominator$:Observable<string>;
  @Output() valueChange = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
    this.denominator$.subscribe(d=>{
      this.denominator =d;
    })
  }
  ngAfterViewInit() {
    document.addEventListener("DOMContentLoaded", this.setValue);
    this.range.nativeElement.addEventListener('input',this.setValue);
  }
  setValue = ()=>{
    let range= this.control.value;
    const newValue = Number( (range - this.min) * 100 / (this.max- this.min) ),
      newPosition = 10 - (newValue * 0.2);
    this.rangeV.nativeElement.innerHTML = `<span class="box-shadow"><b>${range} ${this.denominator}</b></span>`;
    this.rangeV.nativeElement.style.left = `calc(${newValue}% + (${newPosition}px))`;
  };
}
