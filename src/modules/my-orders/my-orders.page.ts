import { Component, OnInit, ElementRef, ViewChild   } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup,FormControl  } from '@angular/forms';
import { IonSlides } from '@ionic/angular';
import{UserService} from 'src/core/services/user/user.service';
import {MatTabChangeEvent} from '@angular/material';
import { AlertController } from '@ionic/angular';
import { Chart } from 'chart.js';
import{AuthenticationService} from 'src/core/services/authentication/authentication.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.page.html',
  styleUrls: ['./my-orders.page.scss'],
})
export class MyOrdersPage implements OnInit {
   segment = 0;   
   
   public isLoading = false;
   public searchValue : any='';
   public isAddPage = false;
   public vehicleList =[];
   statusList :string[]=["running","idle","stop"];
   public filterDataList =[];
  public chartDataList =[];
  public lineChart:any;
  public selectedPageKey:any;
   public vehicleTypeList =[];
   public defaultTabIndex : number = 0;
   @ViewChild('slides', { static: true }) slider: IonSlides;   
   @ViewChild('barCanvas',{ static: true }) private barCanvas: ElementRef;
   @ViewChild('doughnutCanvas',{ static: true }) private doughnutCanvas: ElementRef;
   @ViewChild('lineCanvas',{ static: true }) private lineCanvas: ElementRef;
   barChart: any;
   doughnutChart: any;
   public  isLoadingGraphData =false;
   public dashboardDataList=[];
   
  constructor(
    private route: Router,
    public userService:UserService,
    public alertController:AlertController,
    public authService :AuthenticationService) { }

    filterForm = new FormGroup({
      companyName: new FormControl(),
      vehicleType: new FormControl(),
      isActive: new FormControl(),
    });

    get companyName() {
      return this.filterForm.get('companyName');
    }
    
    get vehicleType() {
      return this.filterForm.get('vehicleType');
    }
    get isActive() {
      return this.filterForm.get('isActive');
    }


    ionViewDidEnter(){
      this.getAllVehicleList(); 
    }

  ngOnInit() {
    this.vehicleTypeList =  JSON.parse(localStorage.getItem('vehicleTypeList'));
    this.getAllVehicleList();
    this.getAllDashboardData();
  }


   /*
    Author:Kapil Soni
    Funcion:getAllVehicleList
    Summary:getAllVehicleList for get vehicle list
    Return list
  */
    getAllVehicleList() {
      this.isLoading = true;
      this.userService.getDataByUrl('showAllVehicleData').subscribe((data:any)=>{
        if(data.length>0){
          this.vehicleList = data;
          this.isLoading = false;
          this.filterDataList = this.vehicleList;
        } else{
          this.isLoading = false;
          this.vehicleList= [];
        }
      },  error => {
        this.vehicleList = [];
        this.isLoading = false;
      })
    }

  async segmentChanged() {
    await this.slider.slideTo(this.segment);
  }

  async slideChanged() {
    this.segment = await this.slider.getActiveIndex();
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
      deleteDriver(value){
        this.userService.deleteDataFromDb(value,'deleteVehicleByID').subscribe((data:any)=>{
          if(data.message){
            this.getAllVehicleList();
           this.authService.successToast(data.message);
          }
        }, error => {
         this.authService.errorToast(error.error.message);
        })
      }

      redirectPageViaKey(key,data){
        key == 'add' ? this.isAddPage = true : this.isAddPage = false;
        this.route.navigate(['./add-vehicle'],<any>{state: {addPage: this.isAddPage,data: data,vehicleList:this.vehicleList}});
      }
    
      onInput(){
        if(this.searchValue.length >0){
          this.vehicleList = this.filterDataList.filter((data) => {
            return data.company.companyName.toLowerCase().indexOf(this.searchValue.toLowerCase()) > -1 ||
            data.vehicleNumber.toLowerCase().indexOf(this.searchValue.toLowerCase()) > -1;
          })
        }else{
          this.getAllVehicleList();
        }
      }

      onCancel(){
        this.searchValue = "";
         this.vehicleList = this.filterDataList;
     }

     tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
      console.log('index => ', tabChangeEvent.index);

      switch (tabChangeEvent.index) {
        case 0:
          this.getAllVehicleList()
          break;
        case 1:
          this.vehicleList = this.filterDataList.filter(x=>x.status == 'running');
          break;
        case 2:
          this.vehicleList = this.filterDataList.filter(x=>x.status == 'idle');
          break;
        default:
          this.vehicleList = this.filterDataList.filter(x=>x.status == 'stop');
          break;
      }
    }

    
    /*
    Author:Kapil Soni
    Funcion:getAllDashboardData
    Summary:getAllDashboardData for get vehicle list
    Return list
  */
  getAllDashboardData() {
    this.isLoading = true;
    this.userService.getDataByUrl('DashboardData').subscribe((data:any)=>{
      if(data){
        this.dashboardDataList = data;
        this.isLoading =false;
      }
    })
  }


  generateGraphByKey(key){
    this.isLoadingGraphData = true;
    var apiURL :any;
    this.selectedPageKey =key;
    switch (key) {
      case 'customer':
        apiURL = 'CustomerChartData';
        break;
        case 'vehicle':
          apiURL = 'VehicleChartData'; 
          break;
        case 'kmTracked':
          apiURL = 'KmsTrackedChartData'; 
          break;
        case 'trackers':
          apiURL = 'TrackersChartData'; 
          break;
        case 'simCard':
          apiURL = 'SimCardChartData'; 
          break;
        case 'trips':
          apiURL = 'TripsChartData'; 
          break;
        case 'ticket':
          apiURL = 'TicketRaisedChartData'; 
          break;
        case 'liveTracking':
          apiURL = 'VehicleLiveTrackingChartData'; 
          break;
      default:
        break;
    }

    this.userService.getDataByUrl(apiURL).subscribe((data:any)=>{
      if(data){
         // Now we need to supply a Chart element reference with an object that defines the type of chart we want to use, and the type of data we want to display.
       this.barChart = new Chart(this.barCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: data.labels,
          datasets: [{
            label: '# of Votes',
            data: data.data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
      this.isLoadingGraphData =false;
      }
    })
  }

}
