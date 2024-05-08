import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

import { MonitorService } from "src/app/core/services/monitor.service";

import { FilterPopupComponent } from "../filter-popup/filter-popup.component";

@Component({
  selector: "app-filter-table-base",
  templateUrl: "./filter-table-base.component.html",
  styleUrls: ["./filter-table-base.component.scss"],
})
export class FilterTableBaseComponent implements OnInit, AfterViewInit, OnChanges {
  @Input("apiName") apiName: string = "";
  @Input("tableData") tableData: any[];

  @ViewChild(MatSort) sort: MatSort;
  dataKeys: string[] = [];
  dataSource: MatTableDataSource<any>;
  listFilters: Map<String, any[]>;
  allDataForFilter: any[] = [];

  constructor(public dialog: MatDialog, public monitorService: MonitorService) {}

  ngOnInit(): void {
    this.initializeTable();
  }

  initializeTable() {
    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataKeys = Object.keys(this.tableData[0]);
    this.allDataForFilter = this.tableData;
    this.getFilterList();
  }

  formatHeaderName(value) {
    let splitres = value.split("_").map((v) => {
      return v.charAt(0).toUpperCase() + v.slice(1);
    });
    return splitres.join(" ");
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["tableData"]) {
      this.initializeTable();
      this.dataSource.sort = this.sort;
    }
  }

  openFilterPopup(event: MouseEvent, column: String) {
    event.stopPropagation();
    this.dialog.open(FilterPopupComponent, {
      data: {
        column,
        apiName: this.apiName,
        data: this.allDataForFilter,
      },
    });
  }

  getFilterList() {
    this.monitorService[`get${this.apiName}`]().subscribe((res) => {
      this.listFilters = res;
      let searchData = [];
      if (this.listFilters.size > 0) {
        let filterKeys = Array.from(this.listFilters.keys());
        let currentTable = this.tableData;
        for (let value of filterKeys) {
          currentTable = currentTable.filter((res) => {
            let filterValues = this.listFilters.get(value);
            for (let x of filterValues) {
              if (res[value as string] == x) {
                return res;
              }
            }
          });
        }
        searchData = currentTable;
      } else {
        searchData = this.tableData;
      }
      this.dataSource = new MatTableDataSource(searchData);
      this.dataSource.sort = this.sort;
      this.allDataForFilter = searchData;
    });
  }

  sortChange(data) {
    console.log(data);
  }

  // setFilterList(column: String, selectedItems: any[]) {
  //   let listMap: Map<String, any[]> = this.listFilters;
  //   if (selectedItems.length == 0) {
  //     listMap.delete(column);
  //   } else {
  //     listMap.set(column, selectedItems);
  //   }
  //   this.monitorService[`set${this.apiName}`](listMap);
  // }
}
