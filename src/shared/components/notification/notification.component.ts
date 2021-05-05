import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SideNavigationList } from 'src/shared/constants/enum';
import { Utility } from 'src/shared/helpers/utility.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
     
  }

}
