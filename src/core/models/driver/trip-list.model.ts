import { VehicleAdd } from "./vehicle-add.model";
import{DiverListModel} from 'src/core/models/driver/driver-list.model';
export class TripListModel {
    id: string;
    vehicle:VehicleAdd;
    driver:DiverListModel;
    createDateTime: string;
    updateDateTime:string;
    startPoint:string;
    endpoint:string;
    vehicleNumber:string;
    routeGeofence:any=[];
    firstName:String;
}