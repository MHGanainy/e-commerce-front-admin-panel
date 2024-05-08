import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MonitorService {
  clientQueueFilters$: BehaviorSubject<Map<String, any[]>>;
  salesListFilters$: BehaviorSubject<Map<String, any[]>>;
  countObservable$: BehaviorSubject<Map<String, any[]>>;

  constructor() {
    this.clientQueueFilters$ = new BehaviorSubject(new Map());
    this.salesListFilters$ = new BehaviorSubject(new Map());
    this.countObservable$ = new BehaviorSubject(new Map());
  }

  setClientQueueFilters(clientQueueList: Map<String, any[]>) {
    this.clientQueueFilters$.next(clientQueueList);
  }

  getCountObservable() {
    return this.countObservable$;
  }
  setCountObservable(count: any) {
    this.countObservable$.next(count);
  }

  getClientQueueFilters() {
    return this.clientQueueFilters$;
  }

  setSalesListQueueFilters(salesList: Map<String, any[]>) {
    this.salesListFilters$.next(salesList);
  }

  getSalesListQueueFilters() {
    return this.salesListFilters$;
  }
}
