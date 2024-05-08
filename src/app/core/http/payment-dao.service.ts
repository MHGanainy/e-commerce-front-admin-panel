import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ClientUserModel } from "src/app/shared/models/ClientUser.model";
import { RejectionModel } from "src/app/shared/models/Rejection.model";

import { ApiService } from "./api.service";
import { GlobalDAOService } from "./global-dao.service";

@Injectable({
  providedIn: "root",
})
export class PaymentDAOService extends GlobalDAOService<any> {
  // tslint:disable: no-redundant-jsdoc

  pageName = "Payment";
  constructor(api: ApiService) {
    super(api);
  }

  getAllBankTrans(): Observable<Object> {
    return this.api.postRequest<Object>(`${this.pageName}/getAllBankTrans`, {});
  }

  /**
   *
   * @param sortedBy - any Property of the TransactionModel object to sorty by.
   * @param order - Either "asc", or "desc"
   */
  getAllVisaTrans(pageSize: Number, pageNumber: Number, sortedBy: String, order: String): Observable<Object> {
    return this.api.postRequest<Object>(
      `${this.pageName}/getAllVisaTrans?pageSize=${pageSize}&pageNumber=${pageNumber}&sortedBy=${sortedBy}&order=${order}`,
      {}
    );
  }

  acceptPrintApproval(transID: String): Observable<Object> {
    return this.api.postRequest<Object>(`${this.pageName}/acceptPrintApproval`, transID);
  }

  acceptTransaction(transID: String): Observable<Object> {
    return this.api.postRequest<Object>(`${this.pageName}/acceptTransaction`, transID);
  }

  rejectTransaction(rejectionModel: RejectionModel): Observable<Object> {
    return this.api.postRequest<Object>(`${this.pageName}/rejectTransaction`, rejectionModel);
  }

  print(id: string) {
    return this.api.postRequestPDF<Object>(`${this.pageName}/print`, id);
  }

  updateSAP(user: ClientUserModel) {
    return this.api.postRequest<Object>(`${this.pageName}/updateSAP`, user);
  }
}
