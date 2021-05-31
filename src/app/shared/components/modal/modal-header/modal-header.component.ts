import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ModalHeaderComponent implements OnInit {

  @ViewChild(TemplateRef)
  headerContent: TemplateRef<any>;
  constructor() { }

  ngOnInit(): void {
  }
}
