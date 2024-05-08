import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { ApiService } from "./api.service";
import { GlobalDAOService } from "./global-dao.service";

@Injectable({
  providedIn: "root",
})
export class AdminTransactionsDAOService extends GlobalDAOService<any> {
  // tslint:disable: ban-types
  pageName = "AdminTransactions";

  constructor(api: ApiService, private http: HttpClient) {
    super(api);
  }

  getOfferID(offerID: any): Observable<Object> {
    return this.api.postRequest<Object>(`${this.pageName}/updatePaymentTime`, offerID);
  }
}
