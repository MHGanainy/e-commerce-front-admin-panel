import { Component, Input, OnInit } from "@angular/core";

import { MonitorService } from "src/app/core/services/monitor.service";

@Component({
  selector: "app-monitor-cards",
  templateUrl: "./monitor-cards.component.html",
  styleUrls: ["./monitor-cards.component.scss"],
})
export class MonitorCardsComponent implements OnInit {
  items: any[] = [
    { label: "Available Sales", color: "#8ae579 25px solid" },
    { label: "On-call Sales", color: "#fd4242 25px solid" },
    { label: "Away Sales", color: "#f9d860 25px solid" },
    { label: "Offline Sales", color: "#9e9e9e 25px solid" },
    { label: "Pending Calls", color: "#6901e1 25px solid" },
  ];
  count: any;
  constructor(private monitorService: MonitorService) {}

  ngOnInit(): void {
    this.monitorService.getCountObservable().subscribe((res) => {
      this.count = res;
    });
  }
}
