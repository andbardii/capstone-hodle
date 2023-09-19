import { Component, OnInit, ViewChild } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { NgForm } from '@angular/forms';
import { Todo } from '../interfaces/todo';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit {

  @ViewChild('f') form!: NgForm;
  error: undefined | string;

  todos:Todo[] = [];
  todo:Todo = {};

  constructor(public svc: TodoService){}

  ngOnInit(): void {
    this.findAll();
  }

  addTodo(){
    this.svc.addTodo(this.todo).subscribe(
      (resp) => {
        console.log(resp);
        this.error = undefined;
        this.findAll();
        this.todo = {};
        this.form.reset()
      }, (err) => {
        console.log(err.error.message);
        this.error = err.error.message;
      }
    )
  }

  findPending() {
  }

  findCompleted() {
  }

  findAll() {
    this.svc.findByUser().subscribe(
      (resp) => {
        console.log(resp);
        this.error = undefined;
        this.todos = resp
      }, (err) => {
        console.log(err.error.message);
        this.error = err.error.message;
      }
    )
  }

  toggleStatus(id: any) {
    this.svc.toggleStatus(id).subscribe(
      (resp) => {
        console.log(resp);
        this.error = undefined;
        this.findAll();
      }, (err) => {
        console.log(err.error.message);
        this.error = err.error.message;
      }
    )
  }

}
