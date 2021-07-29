import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponent implements OnInit {

  @Input()
  color: string;


  @Input()
  canCancel: boolean = false;

  @Input()
  size: string;

  @Output()
  onCancel: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }
  cancel() {
    this.onCancel.emit(true);
  }
}
