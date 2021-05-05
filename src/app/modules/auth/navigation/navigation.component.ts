import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth-navigation',
  template: `
    <div id="auth-navigation">
    <div class="logo animate__animated animate__zoomIn" style="transform: translateY(-5px);">
    <a href="http://vanircapital.org" target="_blank"><img src="../../assets/gifs/Vanir-Capital-Logo.gif" alt="Vanir Capital Logo" /></a>
</div>
    </div>
  `,
  styles: [
    `#auth-navigation{
      display:flex;
      justify-content:center;
      align-items:center;
      width:100%;
      background:#0E0A02;
      height:10vh;
      position:fixed;
      z-index: 99999999999;
    }`
  ]
})
export class NavigationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
