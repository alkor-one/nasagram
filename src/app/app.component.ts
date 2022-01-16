import { Component, OnInit  } from '@angular/core';
import { PhotoService } from './services/photo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'nasagram';
  earthDate: string = '2021-12-21';
  camera: string = 'all';
  page: number = 1;

  constructor(private photoService: PhotoService) {}

  ngOnInit(): void {
    this.getPhotos(this.earthDate, this.camera, this.page);
  }

  getPhotos(earthDate: string, camera: string, page: number): void {
    this.photoService.getPhotos(earthDate, camera, page).subscribe((response) => {
      if (response){
        console.log(response);
      }
    });
  }
}
