import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent implements OnInit,OnChanges {
  @Input()
  totalCount:number;
  @Input()
  maxSize:number =10;
  @Input()
  pagingChangeSubject:BehaviorSubject<any>;
  
  currentPage:number;
  pageSubject:BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  pages$:Observable<number[]> = this.pageSubject.asObservable();


  activeFilterSubject:BehaviorSubject<number> = new BehaviorSubject<number>(1);
  activeFilter$:Observable<number> = this.activeFilterSubject.asObservable();
  constructor() { }

  ngOnInit(): void {
    this.pageSubject.next(this.getPages());
  }

  getPages(){
    let pages = Math.ceil(this.totalCount/this.maxSize);
    pages = pages==0?1:pages;
    this.currentPage  =1;
    return Array.from({length:pages},(v,k)=>k+1);
  }
  ngOnChanges(): void {
    this.pageSubject.next(this.getPages());
  }
  onPageChange(pageNumber:number){
    this.pagingChangeSubject.next({pageNumber,maxSize:this.maxSize});
    this.activeFilterSubject.next(pageNumber)
  }
  prev(){
    if(this.currentPage>1){
    this.currentPage -=1;
    this.onPageChange(this.currentPage);
    }
  }
  next(){
    if(this.currentPage<this.pageSubject.value.length){
      this.currentPage +=1;
      this.onPageChange(this.currentPage);
      }
  }
}
