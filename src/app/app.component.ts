import { Component, OnInit  } from '@angular/core';
import { PhotoService } from './services/photo.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'nasagram';
  earthDate: string | null = '2021-12-21';
  camera: string = 'all';
  page: number = 1;
  photos: any[] = [];
  toCookies: any[] = [];
  fromCookies: any[] = [];
  minDate: Date;
  maxDate: Date;

  constructor(private photoService: PhotoService, private datePipe: DatePipe) {
    this.minDate = new Date(2012, 7, 18);
    this.maxDate = new Date(2021, 11, 21);
  }

  ngOnInit(): void {
    this.getFromCookies();
    this.getPhotos(this.earthDate, this.camera, this.page);
  }

  getPhotos(earthDate: string | null, camera: string, page: number): void {
    this.photoService.getPhotosFromApi(earthDate, camera, page).subscribe((response) => {
      if (response){
        this.photos = response?.photos;
        this.photos.forEach((photo: any) => {
          if (this.fromCookies.length > 0) {
            this.inArray(photo.id, this.fromCookies) ? photo.isLiked = true : photo.isLiked = false;
          }
          else photo.isLiked = false;
        });
        console.log(this.photos);
      }
    });
  }

  inArray(elementId: number, array: any[]): boolean {
    let result: boolean = false;
    array.forEach(element => {
      if(element.id === elementId) {
        result = true;
      }
    });
    return result;
  }

  likePhoto(photoId: number): void {
    this.photos.forEach((photo: any) => {
      if(photo.id === photoId) {
        photo.isLiked = !photo.isLiked;
      }
      if (photo.isLiked && !this.inArray(photo.id, this.toCookies)) {
        this.addToArray(photo, this.toCookies);
      }
      if (!photo.isLiked) {
        this.removeFromArray(photo, this.toCookies);
      }
    });
   document.cookie = `photos=${JSON.stringify(this.toCookies)}`;
  }

  addToArray(photo: any, array: any[]): void {
    array.push(photo);
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
    // if(document.cookie.includes("date=")) {
    //   const cookiesString: any = document.cookie.split("=").pop();
    //   this.earthDate = cookiesString;
    // }

  }

  changeDate(event: MatDatepickerInputEvent<Date>): void{
    this.earthDate = this.datePipe.transform(event.value,'yyyy-MM-dd');
    this.getPhotos(this.earthDate, this.camera, this.page);
    // document.cookie = `date=${this.earthDate}`;
    // console.log(document.cookie);
  }
}
