import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { RequestService } from 'src/app/modules/admin/request/request.service';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DragAndDropComponent implements OnInit {
  nativeElement:any[]=[];

  eventSubject:BehaviorSubject<any> = new BehaviorSubject<any>({});
  event$:Observable<any> = this.eventSubject.asObservable();
  
  
  idSubject:BehaviorSubject<any> = new BehaviorSubject<any>({});
  classListSubject:BehaviorSubject<any> = new BehaviorSubject<any>({});

  showSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show$:Observable<boolean> = this.showSubject.asObservable();
  @Output()
  onClick:EventEmitter<any> = new EventEmitter<any>();
  constructor(private _requestService:RequestService) { }
  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.nativeElement.forEach(n=>{
      n.removeChildren();
    })
  }

  select(value:any){
    this.onClick.emit(value)
  }
  @Input()
  items$:Observable<any[]>;

   drop(event: CdkDragDrop<any[]>) {
    
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
        let data = event.previousContainer.data[event.previousIndex];
        let classList =event.container.element.nativeElement.classList; 
        let id = event.item.element.nativeElement.id;
        this.idSubject.next(id);
        this.classListSubject.next(classList);
                  setTimeout(()=>this.eventSubject.next(event));     
                   this.showSubject.next(true); 

    }
  }
  confirm(){
    let event = this.eventSubject.value;
    this.handleUpdate(event,this.idSubject.value,this.classListSubject.value)();
    this.showSubject.next(false);

  }
  closeModal(){
    this.reverse(this.eventSubject.value);
    this.showSubject.next(false);
  }
   transferNodeToContainer=(node:any, container:any, toIndex:any)=>{
    if (toIndex === container.children.length) {
      container.appendChild(node);
    } else {
      const targetItem = container.children[toIndex];
      targetItem.parentNode.insertBefore(node, targetItem);
    }
  }
  getStatus(classList:any){
    if(!classList) return "";
    return this._requestService.getStatus(classList)
  }
  handleUpdate=(event:any,id:any,classList:any)=>{
    return ()=>{
      
      this._requestService.updateStatus(id,this._requestService.getStatus(classList)).then(c=>{
        if(!c || c.requestStatus != this._requestService.getStatus(classList)){
      this.reverse(event)
       }else{
         
         this.updateListOnDrag(event)
       }
      }).catch(err=>{
        console.log(err)

        this.reverse(event)
      
      })
    }
  }

  reverse(event:any){
    const nodeToMove = event.item.element.nativeElement;
    const { previousContainer, container, previousIndex, currentIndex } = event;
    transferArrayItem(container.data,
         previousContainer.data,
         currentIndex,
         previousIndex);
    // this.transferNodeToContainer(
    //   nodeToMove,
    //   previousContainer.element.nativeElement,
    //   previousIndex
    // );
    this.updateListOnDrag(event, true);
    // Promise.resolve().then(() => {
    //   // container.removeItem(event.item);
    //   this.nativeElement.push(previousContainer.element.nativeElement);
    //   let item =container.element.nativeElement.children[previousIndex];
    //   container.element.nativeElement.removeChild(item);
    //   event.item.dropContainer = previousContainer;
    //   event.item._dragRef._withDropContainer(previousContainer._dropListRef);
    //   previousContainer.addItem(item);
    //   this.updateListOnDrag(event);
    // });
  }
 updateListOnDrag=(event: CdkDragDrop<any[]>,failed:boolean=false)=>{
  let index =       event.previousIndex;
  let value = event.previousContainer.data[event.previousIndex];
  let fromClassList = event.previousContainer.element.nativeElement.classList;
  let toClassList = event.container.element.nativeElement.classList;

  this._requestService.updaterequests(!failed?{from:fromClassList,to:toClassList}:{});
//   if(value){
//   if(fromClassList.contains("todo")){
//     // return "todo";
//     let t = this.todo.filter(x=>value!=x);
//     if(t)this.todo =t;
//   }else{

//     let d = this.done.filter(x=>value!=x);
//     if(d)this.done=d;
//   }

//   if(toClassList.contains("todo")){
//     // return "todo";
//     this.todo.push(value);
//   }else{
//     this.done.push(value);
//   }
// }
//  console.log(this.items)
//   console.log(this.done)
}
}
