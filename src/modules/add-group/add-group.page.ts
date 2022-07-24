import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { UserService } from 'src/core/services/user/user.service';
import { UserGroupAddModel } from 'src/core/models/driver/user-group-add.model';
import { UserGroupListModel } from 'src/core/models/driver/user-group-list.model';
import { AuthenticationService } from 'src/core/services/authentication/authentication.service';
import { Router } from '@angular/router';
import { DataSharingService } from 'src/core/services/data-sharing.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonDataListComponent } from 'src/shared/components/common-data-list/common-data-list.component';
@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.page.html',
  styleUrls: ['./add-group.page.scss'],
  providers: [CommonDataListComponent]
})
export class AddGroupPage implements OnInit {
  public vehicleTypeList = [];
  public companyList = [];
  public companyCloneList = [];
  public permissionList = [];
  public selectedPermission = [];
  public submitted = false;
  public selectedPermissionList: any = [];
  public selectedPermissionCloneList = [];
  public currentItemData = [];
  public currentPage = false;
  public isEdit = false;
  public modelGroup: any = [];
  public vehicleForm: any;
  public groupAdd = new UserGroupAddModel();
  public isLoadingData: boolean = false;
  public currentGroupDetail = new UserGroupListModel();
  public totalPermissionList = [];
  public isEditData = false;
  @ViewChild('itemSelect', { static: false }) content: ElementRef;

  constructor(public userService: UserService,
    public dialog: MatDialog,
    public authService: AuthenticationService,
    public cdref: ChangeDetectorRef,
    public router: Router,
    public dataShare: DataSharingService,
    public commonDataService: CommonDataListComponent) { }

  ngOnInit() {
    this.vehicleTypeList = JSON.parse(localStorage.getItem('vehicleTypeList'));
    this.currentPage = history.state.addPage;
    this.currentGroupDetail = history.state.data;
    this.modelGroup = history.state.permission;
    this.currentGroupDetail.isActive == 'active' ? this.isEditData = true :this.isEditData = false;

    this.getAllMultpleDataViaURL();
  }

  /*
    Author:Kapil Soni
    Funcion:getAllMultpleDataViaURL
    Summary:getAllMultpleDataViaURL for get vehicle list
    Return list
  */
  getAllMultpleDataViaURL() {
    this.userService.getMulipleAPIDataViaUrl('company/showAllCompanyData', 'showAllPermissionData', '', '').subscribe((data: any) => {
      if (data[1].length > 0 || data[0].length > 0) {
        this.companyList = data[1];
        this.companyCloneList = this.companyList;
        this.totalPermissionList = data[0];
        this.currentPage == false ? this.defaultSelectedValue(this.content) :'';
      } else {
        this.companyList = [];
      }
    }, error => {
      this.authService.errorToast(error.error.message);
    })
  }
  /*
    Author:Kapil Soni
    Funcion:getAllCompanyData
    Summary:getAllCompanyData for get vehicle list
    Return list
  */
  addVehicle(form: any) {
    this.vehicleForm = form;
    if (form.form.valid) {
      this.submitted = true;
      this.isLoadingData = true;
      if (this.groupAdd.isActive) {
        this.groupAdd.isActive = 'active';
      } else {
        this.groupAdd.isActive = 'inActive';
      }
      this.userService.storeDataToDb(<any>this.groupAdd, 'saveUserGroup').subscribe((data: any) => {
        if (data.message) {
          this.isLoadingData = false;
          form.resetForm();
          form.reset();
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

  updateDataViaKey(value): void {
    if (value) {
      let data = this.companyList.find(x => x.companyName == value);
      this.groupAdd.company = data;
    }
  }

  optionSelected(event, value, permission) {
    if (event.source._selected) {
      let matched = this.selectedPermissionList.find(x => x.name == event.source.group.label);
      let matchedItem = this.selectedPermissionList.find(x => x.name == permission.name);
      if (matchedItem == undefined) {
        this.currentItemData = [];
      }
      if (matched == undefined && matchedItem == undefined) {
        let data = {
          "lable": value,
          "value": value
        };
        this.currentItemData.push(data);
        this.selectedPermissionList.push({
          'name': event.source.group.label,
          'items': this.currentItemData
        });
      } else {
        let index = this.selectedPermissionList.findIndex(x => x.name == event.source.group.label);
        if (index != -1) {
          let data = {
            "lable": value,
            "value": value
          };
          this.selectedPermissionList[index].name = event.source.group.label;
          this.selectedPermissionList[index].items.push(data);
        }
      }
    } else {
      let matched = this.selectedPermissionList.find(x => x.name == event.source.group.label);
      if (matched) {
        let index = matched.items.findIndex(x => x == value);
        matched.items.splice(index, 1);
        matched.items.length == 0 ? this.selectedPermissionList = [] : this.selectedPermissionList;
      }

      let matchedcloneData = this.selectedPermissionCloneList.find(x => x.name == event.source.group.label);
      if (matchedcloneData) {
        let data = {
          "lable": value,
          "value": value
        };
        let index = matchedcloneData.items.findIndex(x => x == data.value);
        matchedcloneData.items.splice(index, 1);
      }

    }
    //delete (<any>this.groupAdd).companyName;
    this.groupAdd.addPermissions = this.selectedPermissionList;
  }

  search(value: string) {
    let filter = value.toLowerCase();
    let list = this.companyCloneList.filter(option => option.companyName.toLowerCase().startsWith(filter));
    return this.companyList = list;
  }

  toggleEditForm() {
    this.isEdit = this.isEdit ? false : true;
  }

  /*
  Author:Kapil Soni
  Funcion:updateDriverInfo
  Summary:updateDriverInfo for update driver info
  Return list
*/
  updateGroupInfo() {
    //check company name in array...
    let matchedCompany = this.companyList.find(x => x.companyName == this.currentGroupDetail.company.companyName);
    if (matchedCompany) {
      this.currentGroupDetail.company = matchedCompany;
    }
    this.userService.updateData(this.currentGroupDetail, 'updateUserGroupInfo').subscribe((data: any) => {
      if(data.message) {
        this.authService.successToast(data.message);
        this.router.navigate(['/tabs/orders']);
      } else {
        this.authService.errorToast(data.message);
      }
    }, error => {
      this.authService.errorToast(error.error.message);
    })
  }

  /*
    Author:Kapil Soni
    Funcion:getAllVehicleList
    Summary:getAllVehicleList for get vehicle list
    Return list
  */
  defaultSelectedValue(content) {
    let values: any[] = [];
    for (let group of this.totalPermissionList) {
      for (let item of group.items) {
        for (let modelData of this.modelGroup) {
          for (let model_item of modelData.items) {
            if (modelData.name == group.name && model_item.lable == item.lable) {
              values.push(model_item.value);
            }
          }
        }
      }
    }
    // submit the array with all values
    content.update.emit(values);
    this.cdref.detectChanges();
  }
}
