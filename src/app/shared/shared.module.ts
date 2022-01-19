import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination/pagination.component';
import { MatIconModule } from '@angular/material/icon';
import { FlexModule } from '@angular/flex-layout';
import { ShowPhotoComponent } from './show-photo/show-photo.component';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    PaginationComponent,
    ShowPhotoComponent
  ],
  exports: [
    PaginationComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    FlexModule,
    MatDialogModule
  ]
})
export class SharedModule { }
