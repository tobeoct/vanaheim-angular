import { Component, OnInit } from '@angular/core';
import { RequestService } from './request.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {

  constructor(private _requestService: RequestService) { }

  ngOnInit(): void {
      // this._requestService.fetchToken()
    
  }

}
