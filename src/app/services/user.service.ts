import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http
      .get('../../assets/json/database.json')
      .pipe(delay(200), shareReplay());
  }
}
