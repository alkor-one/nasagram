import { Component, OnInit  } from '@angular/core';
import { PhotoService } from './services/photo.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ShowPhotoComponent } from "./shared/show-photo/show-photo.component";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  earthDate: string | null = '2021-12-21';
  camera: string = 'all';
  page: number = 1;
  photos: any[] = [];
  cameraList: any[] = [];
  toCookies: any[] = [];
  fromCookies: any[] = [];
  minDate: Date;
  maxDate: Date;
  selected = 'all';
  totalCount: number | undefined;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  someText: string = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'

  constructor(private photoService: PhotoService, private datePipe: DatePipe, private dialog: MatDialog, private _snackBar: MatSnackBar) {
    this.minDate = new Date(2012, 7, 18);
    this.maxDate = new Date(2021, 11, 21);
  }

  ngOnInit(): void {
    this.getFromCookies();
    this.getPhotos(this.earthDate, this.camera, this.page);
    this.getTotalPages(this.earthDate);
  }

  getPhotos(earthDate: string | null, camera: string, page: number): void {
    this.photoService.getPhotosPerPage(earthDate, camera, page).subscribe((response) => {
      if (response){
        this.photos = response?.photos;
        this.photos.forEach((photo: any) => {
          if (this.fromCookies.length > 0) {
            this.inArrayById(photo.id, this.fromCookies) ? photo.isLiked = true : photo.isLiked = false;
          }
          else photo.isLiked = false;
          if (!this.inArrayByCamera(photo.camera.name, this.cameraList)){
            let cameraObject = { name : photo.camera.name, full_name : photo.camera.full_name };
            this.addToArray(cameraObject, this.cameraList);
          }
        });
      }
    });
  }

  inArrayById(elementId: any, array: any[]): boolean {
    let result: boolean = false;
    array.forEach(element => {
      if(element.id === elementId) {
        result = true;
      }
    });
    return result;
  }

  inArrayByCamera(cameraName: any, array: any[]): boolean {
    let result: boolean = false;
    if(array.length > 0) {
      array.forEach(element => {
        if (element.name === cameraName) {
          result = true;
        }
      });
    }
    return result;
  }

  likePhoto(photoId: number): void {
    this.photos.forEach((photo: any) => {
      if (photo.id === photoId) {
        photo.isLiked = !photo.isLiked;
      }
      if (photo.isLiked && !this.inArrayById(photo.id, this.toCookies)) {
        this.addToArray(photo, this.toCookies);
      }
      if (!photo.isLiked) {
        this.removeFromArray(photo, this.toCookies);
      }
    });
   document.cookie = `photos=${JSON.stringify(this.toCookies)}`;
  }

  addToArray(element: any, array: any[]): void {
    array.push(element);
  }

  removeFromArray(elementToRemove: any, array: any[]): void {
    array.forEach((photo: any) => {
      if(elementToRemove.id === photo.id) {
        const index = array.findIndex(photo => photo.id === elementToRemove.id);
        array.splice(index, 1);
      }
    });
  }

  getFromCookies(): void {
    if(document.cookie.includes("photos=")) {
      const cookiesString: any = document.cookie.split("=").pop();
      this.fromCookies = JSON.parse(cookiesString);
    }
  }

  changeDate(event: MatDatepickerInputEvent<Date>): void {
    this.cameraList = [];
    this.camera = 'all';
    this.earthDate = this.datePipe.transform(event.value,'yyyy-MM-dd');
    this.getTotalPages(this.earthDate);
    this.changePage(1);
  }

  updatePhotos(event: any): void {
    this.camera = event.value;
    this.page = 1;
    if (event.value === 'all') {
      this.getTotalPages(this.earthDate);
    } else this.getTotalPages(this.earthDate, this.camera);
    this.getPhotos(this.earthDate, this.camera, this.page);
  }

    changePage(pageFromPagination: number): void {
    this.page = pageFromPagination;
    this.getPhotos(this.earthDate, this.camera, this.page);
  }

  getTotalPages(earthDate: string | null, camera?: string): void {
    if(camera){
      this.photoService.getPhotosByCamera(earthDate, camera).subscribe((response) => {
        if (response) {
          this.totalCount = response?.photos.length;
        }
      });
    } else {
      this.photoService.getAllPhotosByDate(earthDate).subscribe((response) => {
        if (response) {
          this.totalCount = response?.photos.length;
        }
      });
    }
  }

  public showPhoto(photoUrl?: string): void {
    const dialog = this.dialog.open(ShowPhotoComponent, {
      data: { photoUrl },
      panelClass: 'show-photo-dialog',
    });
  }

  openSnackBar() {
    this._snackBar.open('Photo link copied to clipboard!', 'Close', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  copyToClipBoard(url: string): void {
    if (url) {
      navigator.clipboard.writeText(url);
      this.openSnackBar();
    }
  }
}
