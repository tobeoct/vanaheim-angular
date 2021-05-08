import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tab-header',
  templateUrl: './tab-header.component.html',
  styleUrls: ['./tab-header.component.scss']
})
export class TabHeaderComponent implements OnInit {

  
  @ViewChild(TemplateRef)
  headerContent: TemplateRef<any>;

  constructor() { }

  ngOnInit(): void {
  }

}
