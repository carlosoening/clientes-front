import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

import { HeaderData } from './header-data.model';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private _headerData = new BehaviorSubject<HeaderData>({
    title: '',
    icon: '',
    arrowBack: false,
    buttonType: null,
    route: this.route
  });

  public buttonClicked = new Subject();

  public onSearchChanges = new Subject();
  
  constructor(
    private route: ActivatedRoute
  ) { }

  get headerData(): HeaderData {
    return this._headerData.value;
  }

  set headerData(headerData: HeaderData) {
    this._headerData.next(headerData);
  }
}
