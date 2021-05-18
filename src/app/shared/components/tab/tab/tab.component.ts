import { Component, ContentChild, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TabBodyComponent } from '../tab-body/tab-body.component';
import { TabHeaderComponent } from '../tab-header/tab-header.component';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {
  @Input()
  label: string;

  @Input()
  isActive: boolean;

  @ContentChild(TabBodyComponent)
  bodyComponent: TabBodyComponent;

  @ContentChild(TabHeaderComponent)
  headerComponent: TabHeaderComponent;
  
  constructor() { }

  ngOnInit(): void {
  }

}
