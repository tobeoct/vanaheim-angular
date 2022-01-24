import { AfterContentInit, Component, ContentChildren, EventEmitter, Input, OnInit, Output, QueryList } from '@angular/core';
import { Observable } from 'rxjs';
import { startWith, delay, map } from 'rxjs/operators';
import { TabComponent } from './tab/tab.component';

@Component({
  selector: 'app-tabs',
  templateUrl: './tab-container.component.html',
  styleUrls: ['./tab-container.component.scss']
})
export class TabContainerComponent implements OnInit, AfterContentInit {
  @ContentChildren(TabComponent) contentChildren: QueryList<TabComponent>;
  @Input()
  tabHeaders: any[];
  @Output()
  onClick = new EventEmitter<any>();
  @ContentChildren(TabComponent)
  tabs: QueryList<TabComponent>;

  tabItems$: Observable<TabComponent[]>;

  activeTab: TabComponent;

  constructor() { }
  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
    this.tabItems$ = this.tabs.changes
      .pipe(startWith(""))
      .pipe(delay(0))
      .pipe(map(() => this.tabs.toArray()));
  }

  ngAfterContentChecked() {
    //choose the default tab
    // we need to wait for a next VM turn,
    // because Tab item content, will not be initialized yet
    if (!this.activeTab) {
      Promise.resolve().then(() => {
        this.activeTab = this.tabs.first;
      });
    }
  }

  selectTab(tabItem: TabComponent) {
    if (this.activeTab === tabItem) {
      return;
    }
    this.headerClicked(tabItem.label);
    if (this.activeTab) {
      this.activeTab.isActive = false;
    }

    this.activeTab = tabItem;

    tabItem.isActive = true;
  }

  headerClicked(heading: string) {
    this.onClick.emit(heading);
  }
}
