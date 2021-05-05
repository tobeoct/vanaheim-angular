import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page',
  template: `
    <section>
      <ng-content></ng-content>
    </section>
  `,
  styles: [`
  section{
    flex-direction: column;
  display: flex;
  height:100vh;
  width:100vw;
  overflow:hidden;
  overflow-y:auto;
  }
  `
  ]
})
export class PageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
