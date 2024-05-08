import { BreakpointObserver } from "@angular/cdk/layout";
import { Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";

import { control, CRS, imageOverlay, LatLngBounds, map as leafMap } from "leaflet";
import { PermissionGuard } from "src/app/core/guards/permission.guard";

import { TransactionModel } from "../../../shared/models/Transaction.model";
import { TransactionRejectionPopupComponent } from "../transaction-rejection-popup/transaction-rejection-popup.component";

@Component({
  selector: "app-image-viewer-popup",
  templateUrl: "./image-viewer-popup.component.html",
  styleUrls: ["./image-viewer-popup.component.scss"],
})
export class ImageViewerPopupComponent implements OnInit {
  @ViewChild("imageviewerwrapper") imageWrapper: ElementRef;
  @ViewChild("map") mapElement: ElementRef;

  width = 0;
  height = 0;
  imageSrc: string;
  transaction: TransactionModel;
  imageLoading = true;
  errorLoading = false;
  showReject = true;
  button;
  constructor(
    public permissionGuard: PermissionGuard,
    public matDialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ImageViewerPopupComponent>
  ) {
    this.imageSrc = data.imageUrl;
    if (data.button) {
      this.button = data.button;
    } else {
      this.button = false;
    }
    console.log(this.button);
    if (data.transaction) this.transaction = data.transaction;
    if (data.showReject !== undefined && data.showReject !== null) this.showReject = data.showReject;
  }

  ngOnInit() {
    this.renderMap();
  }

  renderMap() {
    const image = new Image();
    image.src = this.imageSrc as string;
    this.imageLoading = true;
    this.errorLoading = false;
    image.addEventListener("error", () => {
      this.imageLoading = false;
      this.errorLoading = true;
    });
    image.addEventListener("load", () => {
      this.imageLoading = false;
      this.width = image.naturalWidth;
      this.height = image.naturalHeight;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      (this.mapElement.nativeElement as HTMLElement).style.height = `${windowHeight - 150}px`;

      if (this.breakpointObserver.isMatched("(max-width: 599px)")) {
        (this.mapElement.nativeElement as HTMLElement).style.width = `${windowWidth - 100}px`;
      } else {
        (this.mapElement.nativeElement as HTMLElement).style.width = `${(image.width * 3) / 5 - 166}px`;
      }

      const map = leafMap("map", {
        minZoom: 1,
        maxZoom: 5,
        center: [0, 0],
        zoom: 1,
        crs: CRS.Simple,
      });

      const southWest = map.unproject([0, this.height], map.getMaxZoom() - 1);
      const northEast = map.unproject([this.width, 0], map.getMaxZoom() - 1);
      const bounds = new LatLngBounds(southWest, northEast);

      control.zoom({ zoomInText: "+", zoomOutText: "-" });

      imageOverlay(this.imageSrc as string, bounds).addTo(map);

      map.setView(bounds.getCenter(), 3);

      map.setMaxBounds(bounds);
    });
  }

  acceptTransaction() {
    this.dialogRef.close("accept");
  }

  rejectTransaction() {
    this.matDialog
      .open(TransactionRejectionPopupComponent, { panelClass: "md-dialog-container", disableClose: true })
      .afterClosed()
      .subscribe((msg) => {
        if (msg) this.dialogRef.close(["reject", msg]);
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
