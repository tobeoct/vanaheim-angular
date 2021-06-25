import { Component, Input, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { from, Observable } from 'rxjs';
import { RequestService } from 'src/app/modules/admin/request/request.service';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss']
})
export class DragAndDropComponent implements OnInit {
  nativeElement:any[]=[];
  constructor(private _requestService:RequestService) { }
  ngOnInit(): void {
  }

  ngOnDestroy(){
    console.log("Destroying");
    this.nativeElement.forEach(n=>{
      n.removeChildren();
    })
  }
  @Input()
  items$:Observable<any[]>;

   drop(event: CdkDragDrop<any[]>) {
    
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      let data = event.previousContainer.data[event.previousIndex];
      let classList =event.container.element.nativeElement.classList; 
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
        this.handleUpdate(event,data,classList)();
                         

    }
  }
   transferNodeToContainer=(node:any, container:any, toIndex:any)=>{
    if (toIndex === container.children.length) {
      container.appendChild(node);
    } else {
      const targetItem = container.children[toIndex];
      targetItem.parentNode.insertBefore(node, targetItem);
    }
  }
  handleUpdate=(event:any,data:any,classList:any)=>{
    return ()=>{
      
      this._requestService.updateStatus(data.id,this.getStatus(classList)).then(c=>{
        if(!c || c.requestStatus != this.getStatus(classList)){
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
    this.transferNodeToContainer(
      nodeToMove,
      previousContainer.element.nativeElement,
      previousIndex
    );
    Promise.resolve().then(() => {
      // container.removeItem(event.item);
      this.nativeElement.push(previousContainer.element.nativeElement);
      let item =container.element.nativeElement.children[previousIndex];
      container.element.nativeElement.removeChild(item);
      event.item.dropContainer = previousContainer;
      event.item._dragRef._withDropContainer(previousContainer._dropListRef);
      previousContainer.addItem(item);
    });
  }
  getStatus(classList:any){
    if(classList.value.includes("APPROVED")) return "Approved";
    if(classList.value.includes("PROCESSING")) return "Processing";
    if(classList.value.includes("UPDATE")) return "UpdateRequired";
    if(classList.value.includes("DECLINED")) return "Declined";
    return "Pending";
  }
 updateListOnDrag=(event: CdkDragDrop<any[]>)=>{
  let index =       event.previousIndex;
  let value = event.previousContainer.data[event.previousIndex];
  let fromClassList = event.previousContainer.element.nativeElement.classList;
  let toClassList = event.container.element.nativeElement.classList;
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
