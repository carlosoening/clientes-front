import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderService } from 'src/app/layout/components/header/header.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private headerService: HeaderService,
    private route: ActivatedRoute,
  ) { 
    this.headerService.headerData = {
      title: 'Home',
      buttonType: null,
      icon: '',
      route: this.route
    }
  }

  ngOnInit(): void {
  }

}
