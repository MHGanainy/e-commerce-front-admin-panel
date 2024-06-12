import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { UnitModel } from "src/app/shared/models/Unit.model";

@Component({
  selector: "app-unit-details-popup",
  templateUrl: "./unit-details-popup.component.html",
  styleUrls: ["./unit-details-popup.component.scss"],
})
export class UnitDetailsPopupComponent implements OnInit, OnDestroy {
  unitData: UnitModel;

  // Unit Properties To Display For User
  infoProperties: [any[]];
  // Rows Holding The Properties Above, Max Row Elements Count = 2
  infoRows: [any[]];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<UnitDetailsPopupComponent>) {
    this.unitData = data.unitData;

    
  }

  ngOnInit() {
    this.initInfoProperties();
    this.initInfoRows();
  }

  initInfoProperties() {
    // Initializing 2D Array with one Inner Empty Array
    this.infoProperties = [[]];
    // Clearing The 2D Array
    this.infoProperties.pop();

    // Filling The Array
    this.infoProperties.push(["Project", this.unitData.project_name]);
    this.infoProperties.push(["Type", this.unitData.usage_type_text]);
    this.infoProperties.push(["Area", this.unitData.area + " m²"]);
    if (this.unitData.garden > 0) {
      this.infoProperties.push(["Garden Area", this.unitData.garden + " m²"]);
    }
    this.infoProperties.push(["Group", this.unitData.region]);
    
      this.infoProperties.push([
        this.unitData.usage_type_text == "Villa" ? "Villa" : this.unitData.usage_type_text == "Apartment" ? "Building" : "Building/Villa",
        this.removeLeftZeroes(this.unitData.old_unit_code.split("/")[1]),
      ]);
    
    this.infoProperties.push(["Unit", String(this.getUnitTitle(this.unitData))]);
    if (this.unitData.floor) {
      this.infoProperties.push(["Floor", this.unitData.floor]);
    }
    this.infoProperties.push(["Deliver In", this.unitData.delivry_text]);    
  }

  initInfoRows() {
    // Initializing 2D Array with one Inner Empty Array
    this.infoRows = [[]];
    // Clearing The 2D Array
    this.infoRows.pop();

    // Filling The Array
    for (let i = 0; i < this.infoProperties.length; i++) {
      const element = this.infoProperties[i];
      if (i % 2 == 0) {
        this.infoRows.push([element]);
      } else {
        this.infoRows[this.infoRows.length - 1].push(element);
      }
    }

    // Deleting infoProperties From Memory as It's No Longer Needed
    delete this.infoProperties;
  }

  removeLeftZeroes(text: string) {
    for (const i = 0; i < text.length; ) {
      if (text[i] == "0") {
        text = text.replace("0", "");
      } else {
        return text;
      }
    }
  }

  getUnitTitle(unit: UnitModel) {
    if (!unit) return;

    if (unit.usage_type_text == "Apartment") {
      return isNaN(Number(unit.old_unit_code.split("/")[2]))
        ? this.removeLeftZeroes(unit.old_unit_code.split("/")[2])
        : Number(unit.old_unit_code.split("/")[2]);
    } else {
      if (unit.old_unit_code.split("/")[2][0] == "0") {
        return isNaN(Number(unit.old_unit_code.split("/")[1]))
          ? this.removeLeftZeroes(unit.old_unit_code.split("/")[1])
          : Number(unit.old_unit_code.split("/")[1]);
      } else {
        return unit.old_unit_code.split("/")[2][0];
      }
    }
  }

  ngOnDestroy() {
    this.unitData = null;
  }

  close() {
    this.dialogRef.close();
  }
}
