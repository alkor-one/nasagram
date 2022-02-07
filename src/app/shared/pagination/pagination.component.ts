import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnChanges {
  limit: number = 25;
  @Input() totalCount: number | undefined;
  @Output()
  sendPageToParent: EventEmitter<number> = new EventEmitter<number>();
  @Input() page: number = 1;
  pageLimitIndexStart: number = 0;
  pageLimitIndexEnd: number = 10;
  viewPortWidth: number = window.innerWidth > 0 ? window.innerWidth : screen.width;
  totalPages: number[] = [];
  constructor() {}

  ngOnChanges(): void {
    if (this.viewPortWidth < 650) {
      this.pageLimitIndexEnd = 3;
    }
    this.calculatePages();
    this.switchPages(this.page);
  }

  public getContent(page: number): void {
    this.sendPageToParent.emit(page);
  }


  // Switch page numbers if the page number goes above or below than the middle page number of the row
  public switchPages(page: number): void {
    this.setPageNumbersByDevice(page);
    if (this.pageLimitIndexEnd > this.totalPages.length) {
      this.pageLimitIndexEnd = this.totalPages.length;
    }
    const middleOfPages: number = Math.floor(
      (this.pageLimitIndexEnd + this.pageLimitIndexStart + 1) / 2,
    );
    if (page > middleOfPages && this.pageLimitIndexEnd !== this.totalPages.length) {
      this.increasePageNumbers(page, middleOfPages);
    } else if (page < middleOfPages && this.pageLimitIndexStart !== 0) {
      this.decreasePageNumbers(middleOfPages, page);
    }
  }

  private setPageNumbersByDevice(page: number) {
    if (page === 1 && this.viewPortWidth > 650) {
      this.pageLimitIndexStart = 0;
      this.pageLimitIndexEnd = 10;
    } else if (page === 1 && this.viewPortWidth < 650) {
      this.pageLimitIndexEnd = 3;
    }
  }

  private increasePageNumbers(page: number, middleOfPages: number) {
    if (this.pageLimitIndexEnd + (page - middleOfPages) > this.totalPages.length) {
      this.pageLimitIndexStart =
        this.pageLimitIndexStart + (this.totalPages.length - this.pageLimitIndexEnd);
      this.pageLimitIndexEnd = this.totalPages.length;
    } else {
      this.pageLimitIndexStart = this.pageLimitIndexStart + (page - middleOfPages);
      this.pageLimitIndexEnd = this.pageLimitIndexEnd + (page - middleOfPages);
    }
  }

  private decreasePageNumbers(middleOfPages: number, page: number) {
    if (this.pageLimitIndexStart - (middleOfPages - page) < 0) {
      this.pageLimitIndexEnd = this.pageLimitIndexEnd - this.pageLimitIndexStart;
      this.pageLimitIndexStart = 0;
    } else {
      this.pageLimitIndexStart = this.pageLimitIndexStart - (middleOfPages - page);
      this.pageLimitIndexEnd = this.pageLimitIndexEnd - (middleOfPages - page);
    }
  }

  // Calculating of the amount of pages from total items (total count) / items per page (limit)
  public calculatePages(): void {
    this.totalPages.length = 0;
    if (this.totalCount) {
      const totalPagesNumber = Math.ceil(this.totalCount / this.limit);
      let pageNumber = 1;
      for (let i = 0; i < totalPagesNumber; i++) {
        this.totalPages.push(pageNumber++);
      }
    }
  }
}
