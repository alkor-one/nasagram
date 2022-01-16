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

  getPhotos(earthDate: string, camera: string, page: number): Observable<any> {
   // return this.http.get(`${this.getBaseUrl()}quotation-request-statuses`);
    if (camera === 'all')
      return this.http.get(`${this.baseApiUrl}?earth_date=${earthDate}&page=${page}&api_key=${this.apiKey}`);
    else return this.http.get(`${this.baseApiUrl}?earth_date=${earthDate}&camera=${camera}&page=${page}&api_key=${this.apiKey}`);
  }
}
