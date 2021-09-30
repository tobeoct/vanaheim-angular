import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss']
})
export class DropdownOptionComponent implements OnInit {

  @Input()
  class:string;
  @Input()
  value:string;
  @Input()
  label:string;
  @ViewChild(TemplateRef)
  content: TemplateRef<any>;

  constructor() { }

  ngOnInit(): void {
  }

}