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
  cameraList: any[] = [];
  toCookies: any[] = [];
  fromCookies: any[] = [];
  minDate: Date;
  maxDate: Date;
  selected = 'all';
  totalCount: number | undefined;

  constructor(private photoService: PhotoService, private datePipe: DatePipe) {
    this.minDate = new Date(2012, 7, 18);
    this.maxDate = new Date(2021, 11, 21);
  }

  ngOnInit(): void {
    this.getFromCookies();
    this.getPhotos(this.earthDate, this.camera, this.page);
    this.getTotalPages(this.earthDate);
  }

  getPhotos(earthDate: string | null, camera?: string, page?: number): void {
    this.photoService.getPhotosFromApi(earthDate, camera, page).subscribe((response) => {
      if (response){
        this.photos = response?.photos;
        //if(!page)
         // this.totalCount = this.photos.length;
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
         console.log("app:" + this.photos.length);
        // console.log(this.totalCount);
        // console.log(this.cameraList);
      }
    });
    //if(page) {this.totalCount = this.photos.length;}
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
      if(photo.id === photoId) {
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
    // if(document.cookie.includes("date=")) {
    //   const cookiesString: any = document.cookie.split("=").pop();
    //   this.earthDate = cookiesString;
    // }

  }

  changeDate(event: MatDatepickerInputEvent<Date>): void {
    this.cameraList = [];
    this.camera = 'all';
    this.earthDate = this.datePipe.transform(event.value,'yyyy-MM-dd');
    //this.getPhotos(this.earthDate, this.camera, this.page);
    this.getTotalPages(this.earthDate);
    this.changePage(1);
   // console.log(this.page);

    // document.cookie = `date=${this.earthDate}`;
    // console.log(document.cookie);
  }

  updatePhotos(event: any): void {
    this.camera = event.value;
    if (event.value === 'all') {
      this.getTotalPages(this.earthDate);
    }
    this.getPhotos(this.earthDate, this.camera);
    //else {
      // this.page = 1;
      // this.totalCount = 25;

    //}
   // console.log(event.value);
  }

    changePage(pageFromPagination: number): void {
    this.page = pageFromPagination;
    this.getPhotos(this.earthDate, this.camera, this.page);
  }

  getTotalPages(earthDate: string | null): void {
    this.photoService.getAllPhotos(earthDate).subscribe((response) => {
      if (response) {
        this.totalCount = response?.photos.length;
      }
      });
  }
}
