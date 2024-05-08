import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { TransactionModel } from "src/app/shared/models/Transaction.model";
import { UserModel } from "src/app/shared/models/User.model";
import { environment } from "src/environments/environment";

import { ApiService } from "./api.service";
import { GlobalDAOService } from "./global-dao.service";

@Injectable({
  providedIn: "root",
})
export class UserDAOService extends GlobalDAOService<any> {
  // tslint:disable: ban-types
  pageName = "User";

  constructor(api: ApiService) {
    super(api);
  }

  createOne(newData: any): Observable<Object> {
    return this.api.postRequest<Object>(`${this.pageName}/createone`, newData);
  }
  getVerificationCode(number: string): Observable<Object> {
    return this.api.postRequest<Object>(`${this.pageName}/getVerificationCode`, number);
  }
  login(newData: any): Observable<Object> {
    return this.api.postRequest<Object>(`${this.pageName}/login`, newData);
  }

  logout(): Observable<Object> {
    return this.api.postRequest<Object>(`${this.pageName}/logout`, {});
  }

  getUser(): Observable<Object> {
    return this.api.postRequest<Object>(`${this.pageName}/getUser`, {});
  }

  getAllUsers(): Observable<UserModel[]> {
    return new Observable<UserModel[]>((observer) => {
      this.api.postRequest<UserModel[]>(`${this.pageName}/getall`, {}).subscribe((res) => {
        // Sorting Users
        const sortedRes = res.sort((a, b) => {
          if ((a.firstName + " " + a.lastName).toLowerCase() > (b.firstName + " " + b.lastName).toLowerCase()) return 1;
          else if ((a.firstName + " " + a.lastName).toLowerCase() < (b.firstName + " " + b.lastName).toLowerCase()) return -1;
          else return 0;
        });

        // Sorting Roles in Users
        for (const user of sortedRes) {
          user.roles = user.roles.sort((a, b) => {
            if ((a.role._id + " " + a.role._id).toLowerCase() > (b.role._id + " " + b.role._id).toLowerCase()) return 1;
            else if ((a.role._id + " " + a.role._id).toLowerCase() < (b.role._id + " " + b.role._id).toLowerCase()) return -1;
            else return 0;
          });
        }

        observer.next(sortedRes);
        observer.complete();
      });
    });
  }

  updateUser(editedUser: UserModel) {
    return this.api.postRequest<UserModel>(`${this.pageName}/update`, editedUser);
  }

  updateUsers(newData: UserModel[]): Observable<UserModel[]> {
    return this.api.postRequest<UserModel[]>(`${this.pageName}/addRoleToUsers`, newData);
  }

  forgetPassword(newData: any): Observable<Object> {
    return this.api.postRequest<Object>(`${this.pageName}/forgetPassword`, newData);
  }

  changePassword(newData: any, newPassword): Observable<Object> {
    return this.api.postRequest<Object>(`${this.pageName}/changePassword?newPassword=${newPassword}`, newData);
  }
  viewId(sapPartnerID: String): string {
    return `${environment.backendUrl}/${this.pageName}/viewId?userId=${sapPartnerID}`;
  }
  getAllWithoutSAPPartner() {
    return this.api.postRequest<object>(`${this.pageName}/getAllWithoutSAPPartner`, {});
  }
  updateClientUserSAP() {
    return this.api.postRequest<object>(`${this.pageName}/updateClientUserSAP`, {});
  }
  createClientUserSAP(data: any) {
    return this.api.postRequest<object>(`${this.pageName}/createClientUserSAP`, data);
  }
  getPaymentIncomplete() {
    return this.api.postRequest<object>(`${this.pageName}/getPaymentIncomplete`, {});
  }
  createPayment(data: TransactionModel) {
    return this.api.postRequest<object>(`${this.pageName}/createPayment`, data);
  }

  findUTM(startDate, endDate) {
    return this.api.postRequest<object>(`${this.pageName}/findUTM`, { dateFrom: startDate, dateTo: endDate });
  }
}
