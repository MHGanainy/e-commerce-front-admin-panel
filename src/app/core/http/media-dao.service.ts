import { Injectable } from "@angular/core";

import { ApiService } from "./api.service";
import { GlobalDAOService } from "./global-dao.service";

@Injectable({
  providedIn: "root",
})
export class MediaDAOService extends GlobalDAOService<any> {
  pageName = "files";

  constructor(api: ApiService) {
    super(api);
  }

  create(data: any) {
    return this.api.postMedia<Object>(`${this.pageName}/create`, data);
  }

  delete(id: any) {
    return this.api.deleteMedia<Object>(`${this.pageName}/delete`, id);
  }

  get(id: any) {
    return this.api.getMedia<Object>(`${this.pageName}`, id);
  }
  getMediaUrl(id: any) {
    return this.api.getMediaUrl(`${this.pageName}`, id);
  }
}
