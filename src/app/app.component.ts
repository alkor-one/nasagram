import { Component, OnInit  } from '@angular/core';
import { PhotoService } from './services/photo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'nasagram';
  earthDate: string = '2021-12-21';
  camera: string = 'all';
  page: number = 1;
  photos: any[] = [];

  constructor(private photoService: PhotoService) {}

  ngOnInit(): void {
    this.getPhotos(this.earthDate, this.camera, this.page);
  }

  getPhotos(earthDate: string, camera: string, page: number): void {
    this.photoService.getPhotosFromApi(earthDate, camera, page).subscribe((response) => {
      if (response){
        this.photos = response?.photos;
        this.photos.forEach((photo: any) => {
          photo.isLiked = false;
        });
        console.log(this.photos);
      }
    });
  }

  likePhoto(photoId: number): void {
    this.photos.forEach((photo: any) => {
      if(photo.id === photoId) {
        photo.isLiked = !photo.isLiked;
      }
    });
  }
}
