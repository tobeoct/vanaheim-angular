import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ElementStyle, ElementSize, ElementState } from 'src/shared/constants/enum';
import { ButtonOptions } from 'src/shared/constants/variables';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class WelcomeNavigationComponent implements OnInit {

  loanButtonOptions:ButtonOptions= new ButtonOptions("Loans",ElementStyle.stroke,"",ElementSize.small,true,ElementState.active);
  invButtonOptions:ButtonOptions= new ButtonOptions("Investment",ElementStyle.stroke,"",ElementSize.small,true,ElementState.default);
  constructor(private router: Router) { }
  @Input() type:string;
  ngOnInit(): void {
  }

  onNavigate(route:string){
    this.router.navigate([route])
  }

}
