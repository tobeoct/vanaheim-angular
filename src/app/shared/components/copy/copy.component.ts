import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Utility } from '../../helpers/utility.service';

@Component({
  selector: 'app-copy',
  templateUrl: './copy.component.html',
  styleUrls: ['./copy.component.scss']
})
export class CopyComponent implements OnInit {

  @Input()
  message:string;

  labelSubject:BehaviorSubject<string> = new BehaviorSubject<string>('Copy');
  label$:Observable<string> = this.labelSubject.asObservable();
  constructor(private _utility:Utility) { }

  ngOnInit(): void {
  }
  
  copy(){
    this._utility.copyToClipboard(this.message);
    this.labelSubject.next("Copied");
    setTimeout(()=>this.labelSubject.next("Copy"),2000)
  }

}
