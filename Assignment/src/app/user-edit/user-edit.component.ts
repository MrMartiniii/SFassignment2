import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserModel } from '../Models';
import { UserService } from '../services/users.service';

import { Router } from '@angular/router';
import { toArray } from 'rxjs';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent {

  ngOnInit(){
    this.getUser()
  }

  user: UserModel = { username: '', email: '', roles: [], groups: [] };
  newGroup = ''

  constructor(private userService: UserService, private router: Router) { }

 async updateUser() {
  let st = await sessionStorage.getItem('user') 

  let uOrigin = JSON.parse(st!);

    console.log(uOrigin, this.user);
    this.userService.userUpdate(uOrigin, this.user).subscribe(data => {
      console.log(data)
      this.router.navigate(['users'])
    });
  }

  async getUser(){
    let st = await JSON.parse(sessionStorage.getItem('user')!);
    this.user.username = st.username;
    this.user.email = st.email
    console.log(st)
  }

  removeGroup(){

  }

  addGroup(){
    if (this.newGroup){
      this.user.groups.push(this.newGroup)
    }
  }

}
