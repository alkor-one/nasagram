import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class PhotoService {
  apiKey: string = 'c5rxYmHzWUSmsXGFpJve1qjnZ2ldZeZZcZDG31KG';
  baseApiUrl: string = 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos';

  constructor(private http: HttpClient) {}

  getPhotosPerPage(earthDate: string | null, camera?: string, page?: number): Observable<any> {
    if (camera === 'all')
      return this.http.get(`${this.baseApiUrl}?earth_date=${earthDate}&page=${page}&api_key=${this.apiKey}`);
    else return this.http.get(`${this.baseApiUrl}?earth_date=${earthDate}&camera=${camera}&page=${page}&api_key=${this.apiKey}`);
  }

  getAllPhotosByDate(earthDate: string | null): Observable<any> {
    return this.http.get(`${this.baseApiUrl}?earth_date=${earthDate}&api_key=${this.apiKey}`);
  }

  getPhotosByCamera(earthDate: string | null, camera: string): Observable<any> {
    return this.http.get(`${this.baseApiUrl}?earth_date=${earthDate}&camera=${camera}&api_key=${this.apiKey}`);
  }
}
