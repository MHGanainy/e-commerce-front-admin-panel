import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";

@Component({
  selector: "app-loading-spinner",
  templateUrl: "./loading-spinner.component.html",
  styleUrls: ["./loading-spinner.component.scss"],
})
export class LoadingSpinnerComponent implements AfterViewChecked {
  @ViewChild("spinnerDiv") spinnerDiv: ElementRef;

  constructor() {}

  ngAfterViewChecked() {
    this.adjustSize();
  }

  private adjustSize(): void {
    const nativeElement = this.spinnerDiv.nativeElement as HTMLDivElement;
    let size: number;
    if (window.innerWidth > window.innerHeight) size = nativeElement.parentElement.offsetHeight / 3;
    else size = nativeElement.parentElement.offsetWidth / 3;

    nativeElement.style.width = `${size}px`;
    nativeElement.style.height = `${size}px`;
    // Adjust border width range between 8 and 16 px
    nativeElement.style.borderWidth = `${size * 0.125 < 16 ? (size * 0.125 > 8 ? size * 0.125 : 8) : 16}px`;
  }
}
