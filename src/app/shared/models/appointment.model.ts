import { AppointmentPropertiesModel } from "./appointmentProperties.model";
import { CustomerUnitModel } from "./customerUnit.model";
import { SalesModel } from "./sales.model";
import { UserModel } from "./user.model";

export class AppointmentModel {
  // tslint:disable-next-line: variable-name
  _id: string = null;

  user: UserModel = null;
  salesman: SalesModel = null;
  creationDate: Date = null;
  callStatus: string = null;
  zoomMeetingCode: string = null;
  appoinmentSAP: string = null;
  schedule: Date = null;
  endDate: Date = null;
  salesmanAssignTime: Date = null;
  note: string = null;
  appointmentStatus: string = null;
  appointmentSource: string = null;
  unitInterested: CustomerUnitModel = null;
  status: string = null;
  queueNum: number = null;
  meetingID: string = null;
  meetingUUID: string = null;
  joinUrl: string;
  startUrl: string;

  properties: AppointmentPropertiesModel[];
}
