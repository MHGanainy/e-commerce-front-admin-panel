import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Params } from "@angular/router";

import { Observable, throwError } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { ServerDatetimeService } from "../services/server-datetime.service";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  // tslint:disable: no-string-literal
  httpOption = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };
  constructor(private http: HttpClient, private serverDateTimeService: ServerDatetimeService) {}

  postRequest<T>(path: string, data: any): Observable<T> {
    return this.http.post<T>(`${environment.backendUrl}/${path}`, data, this.httpOption).pipe(
      map((res) => {
        if (res["type"] === "F") {
          throw new HttpErrorResponse({
            error: res["msg1"],
            statusText: "F",
            status: 2000,
          });
        }
        this.serverDateTimeService.setServerDateTime(res["serverTime"] ? res["serverTime"] : new Date().toISOString());

        return res["data"];
      })
    );
  }

  // tslint:disable-next-line: variable-name
  postRequestPDF<T>(path: string, trans_id: string): Observable<any> {
    return new Observable((Obs) => {
      const oReq = new XMLHttpRequest();
      oReq.open("POST", `${environment.customerBackendUrl}/${path}`, true);
      oReq.setRequestHeader("content-type", "application/json");
      oReq.responseType = "arraybuffer";
      oReq.withCredentials = true;
      oReq.onload = () => {
        const arrayBuffer = oReq.response;
        const byteArray = new Uint8Array(arrayBuffer);
        const blob = new Blob([byteArray], {
          type: "application/pdf",
        });
        Obs.next(blob);
      };
      oReq.send(trans_id);
    });
  }

  getRequest<T>(path: string): Observable<T> {
    return this.http.get<T>(`${environment.backendUrl}/${path}`, this.httpOption).pipe(
      map((res) => {
        if (res["type"] === "F") {
          throw new HttpErrorResponse({
            error: res["msg1"],
            statusText: "F",
            status: 2000,
          });
        }
        return res["data"];
      })
    );
  }
  getRequestMediaFromServer<T>(path: string): Observable<T> {
    return this.http.get<T>(`${environment.backendUrl}/${path}`).pipe(
      map((res) => {
        return res;
      })
    );
  }

  postMedia<T>(path: string, data) {
    return this.http.post<T>(`${environment.mediaUrl}/${path}`, data);
  }
  getMediaUrl(path: string, id) {
    return `${environment.mediaUrl}/${path}/${id}`;
  }
  getMedia<T>(path: string, id) {
    return this.http.get<T>(`${environment.mediaUrl}/${path}/${id}`);
  }

  deleteMedia<T>(path: string, id) {
    return this.http.delete<T>(`${environment.mediaUrl}/${path}/${id}`);
  }

  postRequestExcel<T>(path: string, params: Params) {
    const option = new HttpHeaders({
      "content-type": "application/vnd.ms-excel",
    });
    return this.http.get(`${environment.backendUrl}/${path}`, {
      headers: option,
      observe: "response",
      responseType: "blob",
      params,
    });
  }
}
