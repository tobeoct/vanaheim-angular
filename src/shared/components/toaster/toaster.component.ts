import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss']
})
export class ToasterComponent implements OnInit {

  @Input() show = false;
  constructor() { }

  ngOnInit(): void {
  }

  reload() {
    document.location.reload();
  }
}
