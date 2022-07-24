import { Injectable,OnInit } from '@angular/core';
import { fromEvent, Observable, Subscription } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class ResizeServiceService{
  resizeObservable$: Observable<Event>
  resizeSubscription$: Subscription;
  public isMobileView :boolean = false;
  constructor() { 
    this.resizeWindow();
    this.listenMobileEvent();
  }

  resizeWindow() {
    this.resizeObservable$ = fromEvent(window, 'resize');
  }


  listenMobileEvent(){
    if(/Android|iPhone/i.test(navigator.userAgent)){
      this.isMobileView=true;
    }
    this.resizeObservable$.subscribe( (evt:any) => {
      if(/Android|iPhone/i.test(navigator.userAgent)){
        return  this.isMobileView=true;
      }else{
        return this.isMobileView=false;
      }
    })
    return  this.isMobileView;
  }
}
