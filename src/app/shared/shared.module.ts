import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination/pagination.component';
import {MatIconModule} from "@angular/material/icon";
import {FlexModule} from "@angular/flex-layout";

@NgModule({
  declarations: [
    PaginationComponent
  ],
  exports: [
    PaginationComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    FlexModule
  ]
})
export class SharedModule { }
