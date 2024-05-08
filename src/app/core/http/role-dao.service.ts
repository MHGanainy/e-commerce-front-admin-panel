import { ApiService } from "./api.service";
import { GlobalDAOService } from "./global-dao.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RoleModel } from "src/app/shared/models/Role.model";

@Injectable({
  providedIn: "root",
})
export class RoleDAOService extends GlobalDAOService<any> {
  // tslint:disable: ban-types
  pageName = "Role";

  constructor(api: ApiService) {
    super(api);
  }

  createOne(newData: RoleModel): Observable<RoleModel> {
    return new Observable<RoleModel>((observer) => {
      this.api.postRequest<RoleModel>(`${this.pageName}/createone`, newData).subscribe((res) => {
        // Removing filter variable from result role
        if (res) {
          delete (res as any).filter;
          observer.next(res);
        } else observer.next(null);

        observer.complete();
      });
    });
  }

  getAllRoles(): Observable<RoleModel[]> {
    return new Observable<RoleModel[]>((observer) => {
      this.api.postRequest<RoleModel[]>(`${this.pageName}/getall`, {}).subscribe((res) => {
        // Sorting Roles
        let modifiedRes = res.sort((a, b) => {
          if (a._id.toLowerCase() > b._id.toLowerCase()) return 1;
          else if (a._id.toLowerCase() < b._id.toLowerCase()) return -1;
          else return 0;
        });

        // Removing filter variable from each role
        modifiedRes = modifiedRes.map((role) => {
          delete (role as any).filter;
          return role;
        });

        observer.next(modifiedRes);
        observer.complete();
      });
    });
  }

  updateRole(newData: RoleModel): Observable<RoleModel> {
    return new Observable<RoleModel>((observer) => {
      this.api.postRequest<RoleModel>(`${this.pageName}/update`, newData).subscribe((res) => {
        // Removing filter variable from result role
        if (res) {
          delete (res as any).filter;
          observer.next(res);
        } else observer.next(null);

        observer.complete();
      });
    });
  }
}
