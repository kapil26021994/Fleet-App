import { Injectable } from '@angular/core';
import {Subject} from  'rxjs';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  public APIhicount =0;
  constructor(
    private loadingController: LoadingController
  ) { }
  public isLoading = new Subject<any>();

  showLoader() {
  this.isLoading.next(true);
  }

  hideLoader() {
    this.isLoading.next(false);
  }
}
