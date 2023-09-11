import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Todo } from '../interfaces/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  headers = new HttpHeaders();

  constructor(private usvc: UserService, private http: HttpClient) { }

  // POST METHODS
  // addTodo(value: any) {
  //   this.headers = this.headers.set(
  //     'Authorization',
  //     'Bearer ' + this.usvc.getToken()
  //   );
  //   console.log(value);
  //   return this.http.post<Todo>('http://localhost:8080/api/todos/add/' + this.usvc.getId() + '/' + value.type, value.name ,{headers: this.headers});
  // }
}
