import { ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Component, ContentChild, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalBodyComponent } from './modal-body/modal-body.component';
import { ModalHeaderComponent } from './modal-header/modal-header.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  // host: {
  //   '(document:click)': 'onClick($event)',
  // }
})
export class ModalComponent implements OnInit {
  @ViewChild('modalContent') modalContent:ElementRef;
  @ContentChild(ModalHeaderComponent) header :ModalHeaderComponent;
  @ContentChild(ModalBodyComponent) body : ModalBodyComponent;


  @Output()
  onChange=new EventEmitter<boolean>();
  @Input() show:boolean|null= false;
  @Input() size:string;
  constructor(private _cd:ChangeDetectorRef) { }

  ngOnInit(): void {
  }
  close=()=>{
    // this.show = false;
    this.onChange.emit(false);
  }
  onClick(event:any) {
    if (!this.modalContent?.nativeElement.contains(event.target))this.close();
   }
}
