import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { RequestService } from 'src/app/modules/admin/request/request.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Utility } from '../../helpers/utility.service';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DragAndDropComponent implements OnInit {
  nativeElement: any[] = [];
  fForm: FormGroup;
  uForm: FormGroup;
  eventSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  event$: Observable<any> = this.eventSubject.asObservable();

  @Input()
  control: FormControl;
  get failureReason() {
    return this.fForm.get("failureReason") as FormControl || new FormControl();
  }
  get mailMessage() {
    return this.fForm.get("mailMessage") as FormControl || new FormControl();
  }
  
  idSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  classListSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});

  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  enterFailureSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  enterFailure$: Observable<boolean> = this.enterFailureSubject.asObservable();

  enterUpdateSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  enterUpdate$: Observable<boolean> = this.enterUpdateSubject.asObservable();

  showSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  show$: Observable<boolean> = this.showSubject.asObservable();
  @Output()
  onClick: EventEmitter<any> = new EventEmitter<any>();
  constructor(private _requestService: RequestService, private _fb: FormBuilder, private _utility: Utility) { }
  ngOnInit(): void {
    this.fForm = this._fb.group({
      failureReason: [""],
      mailMessage: [""]
    });
    this.uForm = this._fb.group({
      mailMessage: [""]
    });
  }

  ngOnDestroy() {
    this.nativeElement.forEach(n => {
      n.removeChildren();
    })
  }

  select(value: any) {
    this.onClick.emit(value)
  }
  @Input()
  items$: Observable<any[]>;

  drop(event: CdkDragDrop<any[]>) {

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      let data = event.previousContainer.data[event.previousIndex];
      let classList = event.container.element.nativeElement.classList;
      if (this.getStatus(classList)=='New') return
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
  
      let id = event.item.element.nativeElement.id;
      this.idSubject.next(id);
      this.classListSubject.next(classList);
      setTimeout(() => this.eventSubject.next(event));
      this.showSubject.next(true);

    }
  }
  confirm() {

    if (this.getStatus(this.classListSubject.value) != "NotQualified" && (this.getStatus(this.classListSubject.value) != "UpdateRequired")) {
      let event = this.eventSubject.value;
      this.handleUpdate(event, this.idSubject.value, this.classListSubject.value)();
      this.showSubject.next(false);
    } else {
      if ((this.getStatus(this.classListSubject.value) == "UpdateRequired")) {
        this.enterUpdateSubject.next(true)
      } else {
        this.enterFailureSubject.next(true);
      }
    }

  }
  closeModal() {
    this.reverse(this.eventSubject.value);
    this.showSubject.next(false);
  }
  transferNodeToContainer = (node: any, container: any, toIndex: any) => {
    if (toIndex === container.children.length) {
      container.appendChild(node);
    } else {
      const targetItem = container.children[toIndex];
      targetItem.parentNode.insertBefore(node, targetItem);
    }
  }
  getStatus(classList: any) {
    if (!classList) return "";
    return this._requestService.getStatus(classList)
  }
  handleUpdate = (event: any, id: any, classList: any) => {
    return () => {

      this._requestService.updateStatus(id, this._requestService.getStatus(classList), (this.getStatus(this.classListSubject.value) == "UpdateRequired")?undefined:this.failureReason.value, (this.getStatus(this.classListSubject.value) == "UpdateRequired")?this.uMailMessage.value:this.mailMessage.value).then(c => {
        this.loadingSubject.next(false)
        this._utility.setSuccess("Successfully updated status and sent email to customer")
        if (!c || c.requestStatus != this._requestService.getStatus(classList)) {
          this.reverse(event)
        } else {

          this.updateListOnDrag(event)
        }
      }).catch(err => {
        console.log(err)

        this.loadingSubject.next(false)
        this._utility.setError(err)
        this.reverse(event)

      })
    }
  }

  reverse(event: any) {
    const nodeToMove = event.item.element.nativeElement;
    const { previousContainer, container, previousIndex, currentIndex } = event;
    transferArrayItem(container.data,
      previousContainer.data,
      currentIndex,
      previousIndex);
    this.updateListOnDrag(event, true);
  }
  updateListOnDrag = (event: CdkDragDrop<any[]>, failed: boolean = false) => {
    let index = event.previousIndex;
    let value = event.previousContainer.data[event.previousIndex];
    let fromClassList = event.previousContainer.element.nativeElement.classList;
    let toClassList = event.container.element.nativeElement.classList;

    this._requestService.updaterequests(!failed ? { from: fromClassList, to: toClassList } : {});
  }


  get uMailMessage() {

    return this.uForm.get("mailMessage") as FormControl || new FormControl();
  }
  onFailure(event: any) {
    this.proceed();
    this.showSubject.next(false)
    this.enterFailureSubject.next(false);
  }
  closeFailureModal() {
    this.proceed();
    this.showSubject.next(false)
    this.enterFailureSubject.next(false);

  }
  closeUpdateModal() {
    // this.proceed();
    this.enterUpdateSubject.next(false);
  }

  onUpdateRequired(event: any) {
    this.proceed();
    this.enterUpdateSubject.next(false);
    this.showSubject.next(false)
  }
  proceed() {
    // if(this.ctrl.value=="NotQualified"){this.enterFailureSubject.next(true)}

    this.handleUpdate(this.eventSubject.value, this.idSubject.value, this.classListSubject.value)();
  }
  onError(value: any): void {
    // this.errorMessageSubject.next(value);
  }
}
