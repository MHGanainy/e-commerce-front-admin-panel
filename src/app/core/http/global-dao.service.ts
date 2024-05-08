import { ApiService } from "./api.service";
import { Observable } from "rxjs";

export class GlobalDAOService<Object> {
  // tslint:disable: ban-types
  pageName: string;

  constructor(protected api: ApiService) {}

  getAll(): Observable<Object> {
    return this.api.postRequest<Object>(`${this.pageName}/getall/`, {});
  }

  getOne(newData: any): Observable<Object> {
    return this.api.postRequest<Object>(`${this.pageName}/getone/`, newData);
  }

  find(
    data: any,
    pageSize: Number,
    pageNumber: Number,
    sortedBy: String,
    order: String,
    filter: any,
    isRecommended: Boolean = false
  ): Observable<Object> {
    data = Object.assign({}, data);
    data["filter"] = filter;
    return this.api.postRequest<Object>(
      `${this.pageName}/find?pageSize=${pageSize}&pageNumber=${pageNumber}&sortedBy=${sortedBy}&order=${order}&isRecommended=${isRecommended}`,
      data
    );
  }

  findAll(data: any, filter: any) {
    data = Object.assign({}, data);
    data["filter"] = filter;
    return this.api.postRequest<Object>(`${this.pageName}/findAll`, data);
  }
}
