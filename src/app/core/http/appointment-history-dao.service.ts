import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from "@angular/common/http";
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
export class AppointmentHistoryDAOService extends GlobalDAOService<any> {
  pageName = "appointmentHistory";
  constructor(api: ApiService) {
    super(api);
  }
  getAppointmentHistory(date: any): Observable<Object> {
    return this.api.postRequest<Object>(`${this.pageName}/findByDate`, date);
  }

  exportToExcel(params: any): Observable<{ file: Blob | null; filename: string | null }> {
    return this.api.postRequestExcel(`${this.pageName}/export`, params).pipe(
      map((res: HttpResponse<Blob>) => {
        return { file: res.body, filename: res.headers.get("content-disposition") };
      })
    );
  }
}
