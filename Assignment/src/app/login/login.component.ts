
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { UserModel } from '../Models';
import { UserService } from '../services/users.service'

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { response } from 'express';
import { error } from 'console';

import { AppComponent } from '../app.component';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};
const BACKEND_URL = 'http://localhost:8888';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {

  user = {username:'', password:''}
  newUser = {username:'', password:'', email:'', roles:['user'], groups:[]}

  constructor(private router:Router, private httpClient: HttpClient, private userService: UserService) { }

  submit() {
    this.userService.userLogin(this.user).subscribe(
      (response:any) => {
        console.log("login successfull", response);
        sessionStorage.setItem('username', response.user.username);
        sessionStorage.setItem('email', response.user.email);
        sessionStorage.setItem('roles', JSON.stringify(response.user.roles));
        sessionStorage.setItem('groups', JSON.stringify(response.user.groups));
        this.router.navigate(['groups'])
      },
      (error) => {
        console.error('login failed', error)
        alert("Invalid username or password")
      }
    );
  }


  signUp(){
    this.userService.userInsert(this.newUser).subscribe(
      (response:any) => {
        console.log("signup successfull", response);
        sessionStorage.setItem('username', response.user.username);
        sessionStorage.setItem('email', response.user.email);
        sessionStorage.setItem('roles', JSON.stringify(response.user.roles));
        sessionStorage.setItem('groups', JSON.stringify(response.user.groups));
      },
      (error) => {
        console.error("signup failed", error)
      }
    )
  }
}
