import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/core/services/authentication/authentication.service';
import { UserService } from 'src/core/services/user/user.service';
import { CompanyManagmentAddModel } from 'src/core/models/driver/company-managment-add.model';
import { ConfirmationDialog } from 'src/shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CompanyManagmentListModel } from 'src/core/models/driver/company-managment-list.model';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

declare var google;
@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.page.html',
  styleUrls: ['./add-company.page.scss'],
})
export class AddCompanyPage implements OnInit {
  public vehicleForm: any;
  public submitted = false;
  public isEdit = false;
  public isLoadingData = false;
  public isLoading =false;
  public currentPage = false;
  public companyAddData = new CompanyManagmentAddModel();
  public currentUserDetail: any = new CompanyManagmentListModel();

  constructor(
    public authService: AuthenticationService,
    public userService: UserService,
    public router: Router,
    public alertController:AlertController,
    public dialog: MatDialog,) { }

  ngOnInit() {
    this.isLoading=true;
    this.currentPage = history.state.addPage;
    this.currentUserDetail = history.state.data;
    this.isLoading=false;
  }

  toggleEditForm() {
    this.isEdit = this.isEdit ? false : true;
  }
  /*
   Author:Kapil Soni
   Funcion:getAllCompanyData
   Summary:getAllCompanyData for get vehicle list
   Return list
 */
  addVehicle(form: any) {
    this.vehicleForm = form;
    this.submitted = true;
    if (form.form.valid) {
      this.isLoadingData = true;
      if (this.companyAddData.isActive) {
        this.companyAddData.isActive = 'active';
      } else {
        this.companyAddData.isActive = 'inActive';
      }
      this.userService.storeDataToDb(<any>this.companyAddData, 'company/saveCompany').subscribe((data: any) => {
        if (data.message) {
          this.isLoadingData = false;
          form.resetForm();
          form.reset();
          this.router.navigate(['/tabs/orders']);
          this.userService.emitLatestValue();
        } else {
          this.authService.errorToast(data.message);
          this.isLoadingData = false;
        }
      }, error => {
        this.isLoadingData = false;
        this.authService.errorToast(error.error.message);
      })
    }
  }


  /*
Author:Kapil Soni
Funcion:updateDriverInfo
Summary:updateDriverInfo for update driver info
Return list
*/
  public isInvalidCompany: boolean = false;
  public isInvalidEmail: boolean = false;
  public isInvalidGstNumber: boolean = false;
  updateCompay() {
    this.submitted = true;
    if (this.currentUserDetail.companyName == '' || this.currentUserDetail.companyName == undefined) {
      this.isInvalidCompany = true;
    } else {
      this.isInvalidCompany = false;
    }
    if (this.currentUserDetail.companyEmail == '' || this.currentUserDetail.companyEmail == undefined) {
      this.isInvalidEmail = true;
    } else {
      this.isInvalidEmail = false;
    }
    if (this.currentUserDetail.gstNumber == '' || this.currentUserDetail.gstNumber == undefined) {
      this.isInvalidGstNumber = true;
    } else {
      this.isInvalidGstNumber = false;
    }
    // if(this.isEditData){
    //   this.currentCompanyDetail.isActive='active';
    // }else{
    //   this.currentCompanyDetail.isActive='inActive';
    // }
    if (!this.isInvalidCompany && !this.isInvalidEmail && !this.isInvalidGstNumber) {
      this.userService.updateData(this.currentUserDetail, 'company/updateCompanyInfo').subscribe((data: any) => {
        if (data.message) {
          this.toggleEditForm();
          this.authService.successToast(data.message);
          this.router.navigate(['/tabs/orders']);
        } else {
          this.authService.errorToast(data.message);
        }
      }, error => {
        this.authService.errorToast(error.error.message);
      })
    }
  }

  removeValidation() {
    if (this.currentUserDetail.companyName) {
      this.isInvalidCompany = false
    }
    if (this.currentUserDetail.companyEmail) {
      this.isInvalidEmail = false;
    }
    if (this.currentUserDetail.gstNumber) {
      this.isInvalidGstNumber = false;
    }
  }


  getStateAndCountryName() {
    var self = this;
    var autocomplete = new google.maps.places.Autocomplete((document.getElementById('companyDetailAutocomplete')), { types: ['geocode'] });
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
      const place = autocomplete.getPlace().address_components;
      self.currentUserDetail.state = place[2].short_name;
      self.currentUserDetail.country = place[3].long_name;
      self.currentUserDetail.city = autocomplete.getPlace().formatted_address;
    });
  }

  async presentAlertConfirm() {
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
            this.userService.deleteDataFromDb(this.currentUserDetail.id, 'company/deleteCompanyByID').subscribe((data: any) => {
              if (data.message) {
                this.authService.successToast(data.message);
                this.router.navigate(['/tabs/orders']);
              }
            }, error => {
              this.authService.errorToast(error.message);
            })
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
    deleteCompany() {
      const dialogRef = this.dialog.open(ConfirmationDialog, {
        panelClass: 'custom-dialog-container',
        data: {
          message: 'Are you sure want to delete?',
          buttonText: {
            ok: 'Delete',
            cancel: 'No',
          },
        },
      });
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.userService.deleteDataFromDb(this.currentUserDetail.id, 'company/deleteCompanyByID').subscribe((data: any) => {
            if (data.message) {
              this.authService.successToast(data.message);
              this.router.navigate(['/tabs/orders']);
            }
          }, error => {
            this.authService.errorToast(error.message);
          })
        }
      });
    }
}
