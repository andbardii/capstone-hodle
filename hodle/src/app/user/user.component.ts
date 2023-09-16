import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit{

  user: User = {};

  constructor(private athsvc:AuthService, private svc:UserService){}

  ngOnInit(): void {
    this.getUser();
  }

  getUser(){
    this.user.id = this.svc.getId();
    this.user.username = this.svc.getUsername();
    this.user.name = this.svc.getName();
    this.user.email = this.svc.getEmail();
    this.user.exp = this.svc.getExp();
    this.user.currency = this.svc.getCurrency();
  }

  logout() {
    this.athsvc.logout();
  }
}
