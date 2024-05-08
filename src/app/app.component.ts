import { Component, OnInit } from "@angular/core";

import { UserDAOService } from "./core/http/user-dao.service";
import { UserDataService } from "./core/services/user-data.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  constructor(private userDAO: UserDAOService, private userService: UserDataService) {
    this.userDAO.getUser().subscribe(
      (res) => {
        this.userService.setSaveUserDataObs(res);
      },
      (err) => {
        this.userService.setSaveUserDataObs(null);
      }
    );
  }

  ngOnInit() {
    console.log("version:1.0");
    window.addEventListener(
      "storage",
      (event) => {
        // tslint:disable-next-line: triple-equals
        if (event.storageArea == localStorage) {
          const userState = localStorage.getItem("userState");
          location.reload();
        }
      },
      false
    );
  }
}
