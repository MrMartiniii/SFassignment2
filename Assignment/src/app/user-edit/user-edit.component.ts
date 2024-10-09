import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupModel, UserModel } from '../Models';
import { UserService } from '../services/users.service';
import { GroupService } from '../services/group.service';

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
    this.getGroups()
  }

  groups: GroupModel[] = [];  

  user: UserModel = { username: '', email: '', roles: [], groups: [] };
  userGroups: string[]=[];
  newGroup = ''

  newRole = ''; // New property for selected role
  availableRoles = ['User', 'superAdmin']; // Example available roles

  constructor(private userService: UserService, private groupService: GroupService, private router: Router) { }

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
    this.user.email = st.email;
    this.user.groups = st.groups;
    this.user.roles = st.roles;
    console.log(st)
  }

  getGroups(): void {
    this.groupService.groupFind().subscribe(data => {
      this.groups = data;
      console.log("test")
    });
  }

  removeGroup(index: number): void {
    if (index > -1) {
      this.user.groups.splice(index, 1); // Remove the group at the specified index
    }
  }

  addGroup(){
    if (this.newGroup){
      this.user.groups.push(this.newGroup)
    }
  }

  addRole() {
    if (this.newRole && !this.user.roles.includes(this.newRole)) {
        this.user.roles.push(this.newRole);
        this.newRole = ''; // Clear input after adding
    }
}

removeRole(index: number) {
    this.user.roles.splice(index, 1); // Remove role by index
}

  cancelEdit(): void {
    this.router.navigate(['users']); // Navigate to the users list or desired page
  }

  

}
