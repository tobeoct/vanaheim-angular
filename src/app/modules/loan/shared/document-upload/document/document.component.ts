import { ChangeDetectorRef } from '@angular/core';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { VCValidators } from '@validators/default.validators';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Utility } from 'src/app/shared/helpers/utility.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { DocumentService } from 'src/app/shared/services/document/document.service';
import { Document, DocumentUpload } from '../document';
let autoIndex = 0;
let showTooltipCount = 0;
const MAXFILEUPLOADSIZE = 2;
@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentComponent implements OnInit, OnDestroy {

  isLoggedIn: boolean;
  @Input()
  control: FormControl;
  @Input()
  title: string;
  @Input()
  description: string;
  @Input()
  fieldClass: string;
  index: number;
  @Output()
  onChange = new EventEmitter<any>();
  @Output()
  onClick = new EventEmitter<any>();
  @Input()
  resetOnUpload = false
  @Input()
  allowedExtensions =
    /(\.jpg|\.jpeg|\.png|\.xls|\.ppt|\.pptx|\.xlsx|\.doc|\.docx|\.odt|\.pdf|\.tex|\.txt|\.rtf|\.wps|\.wks|\.wpd)$/i;
  docToUpload: any;
  allSubscriptions: Subscription[] = [];
  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  showTooltipSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showTooltip$: Observable<boolean> = this.showTooltipSubject.asObservable();

  uploadedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  uploaded$: Observable<boolean> = this.uploadedSubject.asObservable();
  constructor(private _validators: VCValidators,private _utility:Utility, private _authenticationService: AuthService, private _documentService: DocumentService, private _cd: ChangeDetectorRef) { }
  ngOnDestroy(): void {
    autoIndex -= 1;
    this.allSubscriptions.forEach(sub => sub.unsubscribe())
  }
  ngOnInit(): void {
    this.index += 1;
    this.isLoggedIn = this._authenticationService.isLoggedIn();
    if (this.control.value) {
      this.uploadedSubject.next(true);
    }
  }
  onFileChange(event: any) {
    // if(showTooltipCount==0){
    //   this.showTooltipSubject.next(true);
    //   showTooltipCount+=1;

    //   setTimeout(c=>)
    // }
    let reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      const size = file.size / 1024 / 1024;
      if (size > MAXFILEUPLOADSIZE) {
        alert("File too large, File should be smaller than 2MB");
        return;
      }
      if (this.allowedExtensions.exec(file.name)) {
        this.uploadedSubject.next(false);
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.docToUpload = { data: reader.result, name: file.name };
        };
      } else {
        this.onChange.emit({ error: true, message: "Invalid file type" });
        return;
      }


      this.control.patchValue(file.name);
      this.control.markAsTouched();
      this.control.setValidators(this._validators.filterFile(this.allowedExtensions));
      this._cd.markForCheck();
      // need to run CD since file load runs outside of zone
    }
  }

  uploadDocument() {
    if (!this.isLoggedIn) {
      this.onChange.emit({ error: true, message: "Kindly sign in to upload document" });
      return;
    }
    let { data, name } = this.docToUpload;
    this.loadingSubject.next(true);
    let docUpload = new DocumentUpload();
    let doc = new Document();
    docUpload.uploaded = false;
    docUpload.data = data;
    doc.id = 0;
    doc.fileName = name;
    doc.label = this.title;
    docUpload.document = doc;
    let sub = this._documentService.uploadDocument(docUpload).subscribe(d => {
      setTimeout(()=>{

        this.onChange.emit(d);
        this.loadingSubject.next(false);
        this.uploadedSubject.next(true);
        if(this.resetOnUpload){
          this.control.patchValue("")
          this.uploadedSubject.next(false);
          this.showTooltipSubject.next(false)
        }
      },1000)
    });

    this.allSubscriptions.push(sub);
  }

  click(event: any) {
    this.onClick.emit(event);
  }
}
