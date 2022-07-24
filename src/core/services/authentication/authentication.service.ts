import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import{HttpClient} from   '@angular/common/http';
import{BehaviorSubject} from  'rxjs';
// import { ToastrService } from 'ngx-toastr';
import { ToastController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public dataSource = new BehaviorSubject<any>(this.getLoggedInUser());
  constructor(
    public http:HttpClient,
    public loadingCtrl: LoadingController,
    public toastController: ToastController) { }

    async successToast(message) {
      const toast = await this.toastController.create({
        message: message,
        duration: 2000
      });
      toast.present();
  }

  errorToast(message) {
    this.successToast(message);
  }

   getLoggedInUser() {
        const data = localStorage.getItem('user-data');
        return JSON.parse(data);
    }

    getToken(){
      const userData = this.getLoggedInUser();
      return userData && userData['accessToken'];
    }
    
    getUserId(){
      const userData = this.getLoggedInUser();
      return userData && userData['id'];
    }

    saveDataInSession(data) {
      localStorage.setItem('user-data',JSON.stringify(data));
  }

  async dataLoading() {
   await this.loadingCtrl.create({
      // duration: 5000,
    }).then(a => {
      a.present().then(() => {
          a.dismiss().then(() => console.log('abort presenting'));
      });
    });
  }

  async hideLoader() {
     this.loadingCtrl.dismiss();
  }
}
