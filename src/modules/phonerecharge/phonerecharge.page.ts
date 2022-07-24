import { Component, OnInit,ElementRef,ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import{UserService} from 'src/core/services/user/user.service';
import{AuthenticationService} from 'src/core/services/authentication/authentication.service';
import{VehicleAdd} from 'src/core/models/driver/vehicle-add.model';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-phonerecharge',
  templateUrl: './phonerecharge.page.html',
  styleUrls: ['./phonerecharge.page.scss'],
})
export class PhonerechargePage implements OnInit {
  public submitted :boolean = false;
  public vehicleData = new VehicleAdd();
  public isLoadingData : boolean = false;
  public vehicleForm :any;
  public companyList =[];
  public deviceList =[];
  public currentVehicleDetail :any;
  public isEdit = false;
  public vehicleList =[];
  public currentPage : boolean = false;
  public currentTabName :any;
  @ViewChild('f', {static: true}) formRefrence: ElementRef; 

  constructor(
    private modalController: ModalController,
    public navCtrl:NavController,
    public alertController:AlertController,
    public route:Router,
    public userService:UserService,
    public authService:AuthenticationService) { }

  ngOnInit() {
    this.currentVehicleDetail = history.state.data;
    this.currentPage = history.state.addPage;
    this.currentTabName = history.state.segment;
    
    this.vehicleList = history.state.vehicleList;
    this.getAllCompanyData();
    this.showAllVehicleTypeList();
  }
 promocode(){
  } 

    /*
      Author:Kapil Soni
      Funcion:getAllCompanyData
      Summary:getAllCompanyData for get vehicle list
      Return list
    */
      addVehicle(form:any){
        this.vehicleForm = form;
        this.submitted = true;
        if(form.form.valid){
          this.isLoadingData = true;
          if(this.vehicleData.isActive){
            this.vehicleData.isActive='active';
          }else{
            this.vehicleData.isActive='inActive';
          }
  
          let data =  this.deviceList.find(x=>x.deviceType == this.vehicleData.deviceType);
          if(data){
            this.vehicleData.device = data;
          }
          
          this.userService.storeDataToDb(<any>this.vehicleData,'saveVehicle').subscribe((data:any)=>{
            if(data.message){
              this.navCtrl.navigateRoot(['./tabs/orders']);
              this.isLoadingData = false;
              form.resetForm();
               form.reset();
            } else{
              //this.authService.errorToast(data.message);
              this.isLoadingData = false;
            }
          },  error => {
            this.isLoadingData = false;
            //this.authService.errorToast(error.error.message);
          })
        }
      }

     /*
      Author:Kapil Soni
      Funcion:getAllVehicleList
      Summary:getAllVehicleList for get vehicle list
      Return list
    */
      getAllDeviceList() {
        this.userService.getDataByUrl('showAllDeviceData').subscribe((data:any)=>{
          if(data.length>0){
            this.deviceList = data;
          }
        })
      }

           /*
      Author:Kapil Soni
      Funcion:getAllCompanyData
      Summary:getAllCompanyData for get vehicle list
      Return list
    */
    getAllCompanyData() {
      this.userService.getDataByUrl('company/showAllCompanyData').subscribe((data:any)=>{
        if(data.length>0){
          this.companyList = data;
        } else{
          this.companyList= [];
        }
      },  error => {
      })
    }

    
    /*
      Author:Kapil Soni
      Funcion:showAllVehicleTypeList
      Summary:showAllVehicleTypeList for get vehicle list
      Return list
    */
   public vehicleTypeList =[];
   public fuelTypeList =[];
  showAllVehicleTypeList() {
    this.userService.getMulipleAPIDataViaUrl('showAllVehicleType','showAllFuelType','company/showAllCompanyData','').subscribe((data:any)=>{
      if(data.length>0){
        this.vehicleTypeList = data[1];
        this.fuelTypeList  = data[0]
        this.getAllDeviceList();
      }
    })
  }
      
  updateDataViaKey(value,key):void{
    if(value && key == 'company'){
      let data =  this.companyList.find(x=>x.companyName == value);
      this.vehicleData.company = data;
    }
  }

  toggleEditForm() {
    this.isEdit = this.isEdit?false:true;
  }

  async deleteVehicle() {
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
            this.userService.deleteDataFromDb(this.currentVehicleDetail.id,'deleteVehicleByID').subscribe((data:any)=>{
              if(data.message){
                this.route.navigate(['/tabs/orders/']);
              }
            }, error => {
            })
          }
        }
      ]
    });
    await alert.present();
  }

  /*
    Author:Kapil Soni
    Funcion:getAllVehicleList
    Summary:getAllVehicleList for get vehicle list
    Return list
  */
  updateInfo() {
    this.userService.updateData(this.currentVehicleDetail ,'updateVehicleInfo').subscribe((data:any)=>{
      if(data.message){
        this.toggleEditForm();
        this.authService.successToast(data.message);
        this.route.navigate(['/tabs/orders/']);
      } 
    },  error => {
      this.authService.errorToast(error.error.message);
    })
  }
}
