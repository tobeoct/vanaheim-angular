import { Component, OnDestroy, OnInit } from '@angular/core';
import moment = require('moment');
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { DocumentService } from 'src/app/shared/services/document/document.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit, OnDestroy {

  allSubscriptions:Subscription[]=[];
  documents$:Observable<any[]>
  constructor(private _documentService:DocumentService, private _utility:Utility) { }
  ngOnDestroy(): void {
    this.allSubscriptions.forEach(a=>a.unsubscribe())
  }

  ngOnInit(): void {
    this.documents$ = this._documentService.getAllDocuments();
  }
  download(url:string,name:string,requirement:string){
    let fileName = requirement+"_"+ moment().format("ddmmyyyy")+"."+this._utility.getFileExtension(name);
    this._documentService.download(url,fileName);
  }
}
