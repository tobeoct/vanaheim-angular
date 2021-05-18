import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SideNavigationList } from 'src/app/shared/constants/enum';
import { Utility } from 'src/app/shared/helpers/utility.service';

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideNavigationComponent implements OnInit {

  isOpen$:Observable<boolean>;
  constructor(private _utility:Utility) { }

  ngOnInit(): void {
   this.isOpen$ = this._utility.isSideNavOpened$;
  }
  
  toggleSideNav=()=>{
    this._utility.toggleSideNav(SideNavigationList.close);
  }
}
