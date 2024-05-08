import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ServerDatetimeService {
  dateTime$: BehaviorSubject<any>;

  constructor() {
    this.dateTime$ = new BehaviorSubject(null);
  }

  setServerDateTime(datetime: any) {
    this.dateTime$.next(datetime);
  }

  getServerDateTime() {
    return this.dateTime$;
  }
}
