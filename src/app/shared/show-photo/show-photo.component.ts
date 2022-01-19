import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'show-photo',
  templateUrl: './show-photo.component.html',
  styleUrls: ['./show-photo.component.css']
})
export class ShowPhotoComponent implements OnInit {

  photoUrl: string = '';
  constructor(
    public dialogRef: MatDialogRef<ShowPhotoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      photoUrl: string;
    },
  ) {
    if (this.data?.photoUrl) {
      this.photoUrl = this.data?.photoUrl;
    }
  }

  ngOnInit(): void {
  }

}
