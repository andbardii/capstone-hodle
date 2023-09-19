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
  addTodo(value: Todo) {
    value.userId = this.usvc.getId();
    this.headers = this.headers.set(
      'Authorization',
      'Bearer ' + this.usvc.getToken()
    );
    console.log(value);
    return this.http.post<Todo>('http://localhost:8080/api/todo/add', value ,{headers: this.headers});
  }

  // GET METHODS
  findByUser(){
    this.headers = this.headers.set(
      'Authorization',
      'Bearer ' + this.usvc.getToken()
    );
    return this.http.get<Todo[]>('http://localhost:8080/api/todo/byuser/' + this.usvc.getId(), {headers: this.headers});
  }

  // PUT METHODS
  toggleStatus(id: any) {
    this.headers = this.headers.set(
      'Authorization',
      'Bearer ' + this.usvc.getToken()
    );
    console.log(id);
    return this.http.put<Todo>('http://localhost:8080/api/todo/togstatus/'+ id,{headers: this.headers});
  }
}
