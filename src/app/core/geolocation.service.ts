import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor(private http: HttpClient) { }

  public getLocations(location: string) {
    let locationURI = environment.locationSerachAPI;
    locationURI = locationURI.replace('{term}',location);
    return this.http.get(locationURI);
  }
}
