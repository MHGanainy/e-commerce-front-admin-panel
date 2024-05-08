import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
    providedIn: "root"
})
export class UserDataService {
    private saveUserDataObs = new Subject<any>();
    userData = null;

    constructor() { }

    setSaveUserDataObs(value) {
        this.userData = Object.assign({}, value);
        this.saveUserDataObs.next(value);
    }

    getSaveUserDataObs() {
        return this.saveUserDataObs;
    }

}
