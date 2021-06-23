import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { from, Observable } from 'rxjs';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss']
})
export class DragAndDropComponent implements OnInit {

  constructor() { }
  totalCount$:Observable<number> = from([1]);
  ngOnInit(): void {
  }
  items = [
    'Get to work',
    'Pick up groceries',
    'Go home',
    'Fall asleep'
  ];

  done = [
    'Get up',
    'Brush teeth',
    'Take a shower',
    'Check e-mail',
    'Walk dog'
  ];

  drop(event: CdkDragDrop<string[]>) {
    
    if (event.previousContainer === event.container) {
      // console.log(event.container.data[event.currentIndex])
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // console.log(event.previousContainer.data[event.previousIndex])
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
                        this.updateListOnDrag(event)

    }
  }
 updateListOnDrag=(event: CdkDragDrop<string[]>)=>{
   
  console.log("Before")
 console.log(this.items)
  console.log(this.done)
  let value = event.previousContainer.data[event.previousIndex];
  let index =       event.previousIndex;
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
console.log("After")
 console.log(this.items)
  console.log(this.done)
}
}
