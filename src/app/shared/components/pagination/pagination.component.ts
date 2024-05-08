import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-pagination",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.scss"],
})
export class PaginationComponent implements OnInit {
  // @Input() numOfPages: number;
  @Input() set numOfPages(value: number) {
    this.numOfPages = value;
    this.setData();
  }
  @Input() currentPage: number;

  @Output() pageClicked: EventEmitter<number> = new EventEmitter();
  @Output() nextClicked: EventEmitter<void> = new EventEmitter();
  @Output() prevClicked: EventEmitter<void> = new EventEmitter();

  numbersArr: number[];

  constructor() {}

  ngOnInit(): void {}

  private setData() {
    this.numbersArr = new Array(this.numOfPages).fill(null).map((num, index) => index + 1);
  }

  onPageClicked(pageNumber: number) {
    this.pageClicked.emit(pageNumber);
  }

  onNextClicked() {
    this.nextClicked.emit();
  }

  onPrevClicked() {
    this.prevClicked.emit();
  }
}
