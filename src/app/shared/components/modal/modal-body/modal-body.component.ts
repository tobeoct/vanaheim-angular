import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-modal-body',
  templateUrl: './modal-body.component.html',
  styleUrls: ['./modal-body.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ModalBodyComponent implements OnInit {

  @ViewChild(TemplateRef)
  bodyContent: TemplateRef<any>;

  constructor() { }

  ngOnInit(): void {
  }
  

}
