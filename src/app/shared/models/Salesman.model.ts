import { AppointmentPropertiesModel } from "./AppointmentProperties.model";
import { UserModel } from "./User.model";

export class SalesmanModel extends UserModel {
  status: string = null;
  c4c: string = null;
  zoomId: string = null;
  sapemployeeNumber: string = null;
  displayOnly: boolean;
  properties: { key: "language" | "project"; values: string[] }[];
  // languages: string[] = [];
  // projects: string[] = [];
  deActivate: boolean = null;
  // properties: AppointmentPropertiesModel;
  currentAppointmentId: string;

  copyUser(user: SalesmanModel) {
    // tslint:disable-next-line: forin
    for (const element in user) {
      this[element] = user[element];
    }
  }
}
