import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { ApiService } from "./api.service";
import { GlobalDAOService } from "./global-dao.service";

@Injectable({
  providedIn: "root",
})
export class OtpFinderDAOService extends GlobalDAOService<any> {
  pageName = "otp";
  constructor(api: ApiService) {
    super(api);
  }
  getOTP(number: any): Observable<Object> {
    return this.api.postRequest<Object>(`${this.pageName}/getOTP`, number);
  }
}
