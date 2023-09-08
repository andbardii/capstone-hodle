import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  headers = new HttpHeaders();

  constructor(private http: HttpClient, private router: Router) {}

  getToken(): string {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.accessToken;
    } else {
      return '';
    }
  }

  getUsername(): string {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.username;
    } else {
      return '';
    }
  }

  getByUsername(username:String) {
    this.headers = this.headers.set(
      'Authorization',
      'Bearer ' + this.getToken()
    );
    return this.http.get<Cliente>('http://localhost:8080/api/clienti/'+ id, {
      headers: this.headers
    });
  }

}
