import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { ApiService } from "./api.service";
import { GlobalDAOService } from "./global-dao.service";

@Injectable({
  providedIn: "root",
})
export class MonitorDAOService extends GlobalDAOService<any> {
  pageName = "Monitor";
  constructor(api: ApiService) {
    super(api);
  }

  getCustomerQueue(): Observable<Object> {
    return this.api.postRequest<Object>(`${this.pageName}/CustomerQueue`, {});
  }

  getSalesQueue(): Observable<Object> {
    return this.api.postRequest<Object>(`${this.pageName}/Salesmen`, {});
  }
}
