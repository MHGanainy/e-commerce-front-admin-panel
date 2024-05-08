import { SelectionModel } from "@angular/cdk/collections";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatListOption, MatSelectionList } from "@angular/material/list";

import { MonitorService } from "src/app/core/services/monitor.service";

@Component({
  selector: "app-filter-popup",
  templateUrl: "./filter-popup.component.html",
  styleUrls: ["./filter-popup.component.scss"],
})
export class FilterPopupComponent implements OnInit {
  @ViewChild("items") itemList: MatSelectionList;
  apiName: String;
  filterSearch: String;
  alllistData: any[];
  searchListData: any[] = [];
  columnName: String;
  selectedItems: any[];
  localSelectedItemsBeforeSearch: SelectionModel<MatListOption>;
  constructor(
    private dialogRef: MatDialogRef<FilterPopupComponent>,
    private monitorService: MonitorService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.columnName = this.data["column"];
    this.apiName = this.data["apiName"];
    let parsedData = (this.data["data"] as any[])
      .filter((val) => {
        return val[this.columnName as string] != null;
      })
      .map((res) => {
        return res[this.columnName as string];
      });
    let checkfor = new Set(parsedData);
    this.alllistData = [...checkfor];
  }

  ngOnInit(): void {
    this.searchListData = this.alllistData;
    let list = this.monitorService[`get${this.apiName}`]().getValue();
    this.selectedItems = list.get(this.columnName);
  }

  search(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchListData = this.alllistData.filter((value: String) => {
      let p = value.toLocaleLowerCase().indexOf(filterValue.toLocaleLowerCase()) >= 0;
      console.log(value.toLocaleLowerCase().indexOf(filterValue.toLocaleLowerCase()));
      return p;
    });
  }

  closePopup() {
    let selectedItems = this.itemList.selectedOptions;
    let listItems = selectedItems.selected.map((res) => {
      return res.value;
    });
    let listMap: Map<String, any[]> = this.monitorService[`get${this.apiName}`]().getValue();
    if (listItems.length == 0) {
      listMap.delete(this.columnName);
    } else {
      listMap.set(this.columnName, listItems);
    }
    this.monitorService[`set${this.apiName}`](listMap);
    this.dialogRef.close();
  }
}
