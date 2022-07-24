import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { UserService } from 'src/core/services/user/user.service';
import { MatTabChangeEvent } from '@angular/material';
import { AlertController } from '@ionic/angular';
import { AuthenticationService } from 'src/core/services/authentication/authentication.service';
import{LoaderService} from 'src/core/services/loader/loader.service';


@Component({
  selector: 'app-common-data-list',
  templateUrl: './common-data-list.component.html',
  styleUrls: ['./common-data-list.component.scss'],
})
export class CommonDataListComponent implements OnInit {

  public dataList = [];
  public isAddPage = false;
  public filterDataList = [];
  segment = 0;
  public defaultTabIndex: number = 0;
  public searchValue: any;
  @ViewChild('slides', { static: true }) slider: IonSlides;
  @Input() currentSlideIndex: any;
  public apiURL: any;
  public isLoading =false;
  constructor(
    public userService: UserService,
    public alertController: AlertController,
    public authService: AuthenticationService,
    public loaderService:LoaderService,
    public route: Router) { }

  ngOnInit() {
    this.userService.updatedValueEmitter$.subscribe(data=>{
      if(data){
        this.getListByPage();
      }
    })
    this.getListByPage();
  }

  ionViewDidEnter() {
    //this.getAllVehicleList();
  }

  ngOnChanges() {
    this.currentSlideIndex = this.currentSlideIndex.toString();
    localStorage.setItem('screenCount',this.currentSlideIndex);
   this.getListByPage();
  }

  /*
  Author:Kapil Soni
  Funcion:getAllVehicleList
  Summary:getAllVehicleList for get vehicle list
  Return list
*/
  getListByPage() {
    this.isLoading = true;
    switch (this.currentSlideIndex) {
      case "0":
        // this.authService.dataLoading();
        this.apiURL = 'company/showAllCompanyData';
        break;
      case "1":
        // this.authService.dataLoading();
        this.apiURL = 'showAllVehicleData';
        break;
      case "2":
        //this.authService.dataLoading();
        this.apiURL = 'showAllUserGroupData';
        break;
      default:
        break;
    }
    this.userService.getDataByUrl(this.apiURL).subscribe((data: any) => {
      if (data.length > 0) {
        this.dataList = data;
        this.isLoading = false;
        this.filterDataList = this.dataList;
      } else {
        this.isLoading = false;
      }
    }, error => {
      this.dataList = [];
      this.isLoading = false;
      this.isLoading = false;
    })
  }

  redirectPageViaKey(key, data) {
    key == 'add' ? this.isAddPage = true : this.isAddPage = false;
    switch (this.currentSlideIndex.toString()) {
      case '0':
        this.route.navigate(['./add-company'], <any>{ state: { addPage: this.isAddPage, data: data, vehicleList: this.dataList } });
        break;
      case '1':
        this.route.navigate(['./add-vehicle'], <any>{ state: { addPage: this.isAddPage, data: data, vehicleList: this.dataList } });
        break;
      case '2':
        this.route.navigate(['./add-group'], <any>{ state: { addPage: this.isAddPage, data: data, vehicleList: this.dataList,permission:data.addPermissions } });
        break;
      default:
        break;
    }
  }

  async presentAlertConfirm(value) {
    var self = this;
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Warning!',
      message: 'Are you sure want to delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            self.deleteDriver(value);
          }
        }
      ]
    });
    await alert.present();
  }

  /*
  Author:Kapil Soni
  Funcion:deleteVehicle
  Summary:deleteVehicle for get delete vehicle
  Return list
*/
  deleteDriver(value) {
    this.currentSlideIndex =localStorage.getItem('screenCount');
    if (value) {
      switch (this.currentSlideIndex) {
        case "1":
          this.apiURL='deleteVehicleByID';
          break;
        case "0":
          this.apiURL='company/deleteCompanyByID';
          break;
        case "2":
          this.apiURL='deleteUserGroupByID';
          break;
        default:
          break;
      }
      this.userService.deleteDataFromDb(value, this.apiURL).subscribe((data: any) => {
        if (data.message) {
          this.route.navigate(['/tabs/orders']);
          this.getListByPage();
          this.authService.successToast(data.message);
        }
      }, error => {
        this.authService.errorToast(error.error.message);
      })
    }
  }

  async segmentChanged() {
    await this.slider.slideTo(this.segment);
  }

  async slideChanged() {
    this.segment = await this.slider.getActiveIndex();
  }

  onInput() {
    if (this.searchValue && this.searchValue.length > 0) {
      switch (this.currentSlideIndex) {
        case "0":
          this.dataList = this.filterDataList.filter((data) => {
            return data.companyName.toLowerCase().indexOf(this.searchValue.toLowerCase()) > -1 ||
              data.companyEmail.toString().trim().toLowerCase().indexOf(this.searchValue.toLowerCase()) > -1 ||
              data.companyContactNumber.toString().trim().toLowerCase().indexOf(this.searchValue.toLowerCase()) > -1
          })
          break;
        case "1":
          this.dataList = this.filterDataList.filter((data) => {
            return data.vehicleNumber.toLowerCase().indexOf(this.searchValue.toLowerCase()) > -1 ||
              data.company.companyName.toString().trim().toLowerCase().indexOf(this.searchValue.toLowerCase()) > -1 ||
              data.vehicleType != null ? data.vehicleType.toLowerCase().indexOf(this.searchValue.toLowerCase()) > -1 : '';
          })
          break;
        case "2":
          this.dataList = this.filterDataList.filter((data) => {
            return data.groupName.toLowerCase().indexOf(this.searchValue.toLowerCase()) > -1 ||
              data.company.companyName.toString().trim().toLowerCase().indexOf(this.searchValue.toLowerCase()) > -1 ||
              data.company.companyEmail.toLowerCase().indexOf(this.searchValue.toLowerCase()) > -1;
          })
          break;
        default:
          break;
      }

    } else {
      this.getListByPage();
    }
  }

  onCancel() {
    this.searchValue = "";
    this.dataList = this.filterDataList;
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    console.log('index => ', tabChangeEvent.index);

    switch (tabChangeEvent.index) {
      case 0:
        //this.getAllVehicleList()
        break;
      case 1:
        this.dataList = this.filterDataList.filter(x => x.status == 'running');
        break;
      case 2:
        this.dataList = this.filterDataList.filter(x => x.status == 'idle');
        break;
      default:
        this.dataList = this.filterDataList.filter(x => x.status == 'stop');
        break;
    }
  }

}
