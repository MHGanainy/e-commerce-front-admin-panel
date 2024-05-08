import { Component, Input, OnInit } from "@angular/core";

import { MonitorService } from "src/app/core/services/monitor.service";

@Component({
  selector: "app-chosen-filter",
  templateUrl: "./chosen-filter.component.html",
  styleUrls: ["./chosen-filter.component.scss"],
})
export class ChosenFilterComponent implements OnInit {
  @Input("title") title?: string;
  @Input("content") content: string;
  @Input("clear") clearButton: boolean = false;
  @Input("apiName") apiName: string;
  constructor(private monitorService: MonitorService) {}

  ngOnInit(): void {
    if (this.clearButton) {
      this.title = "Clear All";
    }
  }

  removeFromSelectionList() {
    let listMap: Map<String, any[]> = this.monitorService[`get${this.apiName}`]().getValue();
    let matchingList = listMap.get(this.title);
    let contentIndex = matchingList.indexOf(this.content);
    if (contentIndex > -1) {
      matchingList.splice(contentIndex, 1);
    }
    if (matchingList.length == 0) {
      listMap.delete(this.title);
    } else {
      listMap.set(this.title, matchingList);
    }
    this.monitorService[`set${this.apiName}`](listMap);
  }

  clearAllFilters() {
    let listMap: Map<String, any[]> = new Map();
    this.monitorService[`set${this.apiName}`](listMap);
  }
}
