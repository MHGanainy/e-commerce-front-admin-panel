import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSort } from "@angular/material/sort";

import { format } from "date-fns";
import { MonitorDAOService } from "src/app/core/http/monitor-dao.service";
import { MonitorService } from "src/app/core/services/monitor.service";
import { ServerDatetimeService } from "src/app/core/services/server-datetime.service";
import { TimeFunctions } from "src/app/shared/functions/time.functions";
import { GlobalDataModel } from "src/app/shared/models/globalData.model";

import { FilterPopupComponent } from "./components/filter-popup/filter-popup.component";

@Component({
  selector: "app-monitor-queue",
  templateUrl: "./monitor-queue.component.html",
  styleUrls: ["./monitor-queue.component.scss"],
})
export class MonitorQueueComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  customerQueue: any[] = [];
  salesQueue: any[] = [];
  clientListFilters: Map<String, any[]>;
  customerloading: boolean = true;
  salesloading: boolean = true;
  customersyncTime: String = "00:00:00 PM";
  salessyncTime: String = "00:00:00 PM";
  serverTime: any;
  globalData;
  cardsCount = [0, 0, 0, 0];
  constructor(
    private dialog: MatDialog,
    private monitorService: MonitorService,
    private monitorDAO: MonitorDAOService,
    private timeFunctions: TimeFunctions,
    private serverDateTimeService: ServerDatetimeService
  ) {
    this.globalData = new GlobalDataModel();
  }

  ngOnInit(): void {
    this.monitorService.getClientQueueFilters().subscribe((res) => {
      this.clientListFilters = res;
    });

    this.serverDateTimeService.getServerDateTime().subscribe((res) => {
      console.log(res, "timecon");
      this.serverTime = res;
    });

    this.loadData();

    setInterval(() => {
      this.loadData();
    }, 60001);
  }

  loadData() {
    this.getCustomerQueue();
    this.getSalesList();
  }

  getCustomerQueue() {
    this.customerloading = true;
    this.monitorDAO.getCustomerQueue().subscribe((res: any[]) => {
      this.cardsCount[4] = res.filter((c) => {
        return c.status == "pending";
      }).length;
      this.customerQueue = res.map((value) => {
        let countryname;
        if (value.user && value.user.countryCode) {
          for (let i = 0; i < this.globalData.countries.length; i++) {
            if (value.user.countryCode == this.globalData.countries[i].dial_code) {
              countryname = this.globalData.countries[i].name;
            }
          }
        } else {
          countryname = "—";
        }
        let username = value.user ? `${value.user.firstName} ${value.user.lastName}` : "—";

        let compaign = value.user.utmCampaign
          ? value.user.utmCampaign == "undefined" || value.user.utmCampaign == "null"
            ? "—"
            : "/" + value.user.utmCampaign
          : "—";

        let referrer = value.user.utmSource
          ? value.user.utmSource == "undefined" || value.user.utmSource == "null"
            ? "—"
            : value.user.utmSource
          : "—";
        referrer = referrer + compaign;
        let queueNum = value.appointmentType == "SCHDULE" ? `S` : `${value.queueNum}`;
        queueNum = value?.user?.external ? `E.${queueNum}` : queueNum;
        let status = value.status;
        let salesman = value.salesman ? `${value.salesman.firstName} ${value.salesman.lastName}` : "—";
        let call_time = null;
        let appointmentType = value.appointmentType;
        if (value.salesmanAssignTime) {
          let c_date: any = new Date(this.serverTime);
          let assign_time: any = new Date(value.salesmanAssignTime);
          let subtract = c_date - assign_time;
          call_time = this.timeFunctions.formatTime(subtract / 1000);
        }
        let wait_time = null;
        if (value.creationDate) {
          if (value.appointmentType != "SCHDULE") {
            let c_date: any = value.salesmanAssignTime ? new Date(value.salesmanAssignTime) : new Date(this.serverTime);
            let create_date: any = new Date(value.creationDate);
            let subtract = c_date - create_date;
            wait_time = this.timeFunctions.formatTime(subtract / 1000);
          } else {
            wait_time = "—";
          }
        } else {
          wait_time = "—";
        }
        let data = {
          T: { T: appointmentType, external: value?.user.external },
          position: queueNum,
          country: countryname,
          referrer,
          name: username,
          salesman,
          call_time,
          wait_time,
          status,
        };
        console.log(data);
        return data;
      });
      this.customerloading = false;
      this.customersyncTime = format(new Date().getTime(), "HH:mm:ss a");
    });
    this.monitorService.setCountObservable(this.cardsCount);
  }

  getSalesList() {
    this.salesloading = true;
    this.monitorDAO.getSalesQueue().subscribe((res: any[]) => {
      res = res.filter((s) => {
        return s.deActivate == false;
      });
      this.cardsCount[0] = res.filter((s) => {
        return s.status == "online";
      }).length;
      this.cardsCount[1] = res.filter((c) => {
        return c.status == "oncall";
      }).length;
      this.cardsCount[2] = res.filter((s) => {
        return s.status == "away";
      }).length;
      this.cardsCount[3] = res.filter((c) => {
        return c.status == "offline";
      }).length;
      this.salesQueue = res.map((value) => {
        let name = `${value.firstName} ${value.lastName}`;
        let employee_No = value.sapemployeeNumber ? value.sapemployeeNumber : null;
        let status = value.status;
        let data = {
          name,
          status,
        };
        return data;
      });
      this.salesloading = false;
      this.salessyncTime = format(new Date().getTime(), "HH:mm:ss a");
    });
    this.monitorService.setCountObservable(this.cardsCount);
  }

  openFilterPopup(tableName, event) {
    this.dialog.open(FilterPopupComponent, {
      data: {
        column: tableName,
      },
    });
  }
}
