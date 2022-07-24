import { Component, Inject } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { fromEvent, Observable, Subscription } from "rxjs";
import { APP_CONFIG, AppConfig } from './app.config';
import{Router} from '@angular/router'
import{LoaderService} from 'src/core/services/loader/loader.service';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  rtlSide = "left";
  resizeObservable$: Observable<Event>
  resizeSubscription$: Subscription
  showSidebar: boolean = true;
  public currentUseData :any;
  showNavbar: boolean = true;
  showFooter: boolean = true;
  isLoading: Subject<boolean> = this.loaderService.isLoading;
  constructor(@Inject(APP_CONFIG) private config: AppConfig,
    private platform: Platform, private navCtrl: NavController,
    public loaderService:LoaderService,
    public router:Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
  ) {
    this.navCtrl.navigateRoot(['./']);
    this.initializeApp();
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.currentUseData =  JSON.parse(localStorage.getItem('user-data'));
      this.resizeObservable$ = fromEvent(window, 'resize')
      this.checkLoginOrNot();
    });
  }

 ngOnInit() {
 
  }

  checkLoginOrNot(){
    if(this.currentUseData != null){
      this.router.navigate(['/tabs/orders']);
    }else{
      this.router.navigate(['/signin']);
    }
  }
}
