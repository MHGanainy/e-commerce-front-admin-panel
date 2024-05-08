import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";

@Component({
  selector: "app-custom-tooltip",
  templateUrl: "./custom-tooltip.component.html",
  styleUrls: ["./custom-tooltip.component.scss"],
})
export class CustomTooltipComponent implements AfterViewInit {
  @ViewChild("tooltipDiv", { static: true }) tooltipDiv: ElementRef;

  @Input() position: "top" | "bottom" | "right" | "left" = "top";

  constructor() {}

  ngAfterViewInit() {
    const nativeElement = this.tooltipDiv.nativeElement as HTMLDivElement;
    const parentElement = nativeElement.parentElement.parentElement as HTMLElement;
    parentElement.onmouseenter = () => {
      nativeElement.style.opacity = "1";
    };
    parentElement.onmouseleave = () => {
      nativeElement.style.opacity = "0";
    };

    // if (this.position === "top" || this.position === "bottom") nativeElement.style.marginLeft = `${-nativeElement.offsetWidth / 2}px`;
    // tslint:disable-next-line: max-line-length
    // else if (this.position === "right" || this.position === "left") nativeElement.style.marginTop = `${-nativeElement.offsetHeight / 2}px`;

    const viewportOffset = parentElement.getBoundingClientRect();
    // these are relative to the viewport, i.e. the window
    const top = viewportOffset.top;
    const left = viewportOffset.left;

    if (this.position === "top") {
      nativeElement.style.top = `${top - parentElement.offsetTop}px`;
      nativeElement.style.left = `${left - nativeElement.offsetWidth / 2 + parentElement.offsetWidth / 2}px`;
    } else if (this.position === "bottom") {
      nativeElement.style.top = `${top + parentElement.offsetTop}px`;
      nativeElement.style.left = `${left - nativeElement.offsetWidth / 2 + parentElement.offsetWidth / 2}px`;
    } else if (this.position === "right") {
      nativeElement.style.top = `${top - nativeElement.offsetHeight / 2 + parentElement.offsetTop / 2}px`;
      nativeElement.style.left = `${left - nativeElement.offsetWidth / 2}px`;
    } else if (this.position === "left") nativeElement.style.marginTop = `${-nativeElement.offsetHeight / 2}px`;
  }
}
