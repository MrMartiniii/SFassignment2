import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { GroupService } from '../services/group.service'
import { UserService } from '../services/users.service'
import { GroupModel } from '../Models';
import { UserModel } from '../Models';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { error, group } from 'console';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};
const BACKEND_URL = 'http://localhost:8888';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})
export class GroupsComponent {

isAdmin = false;
userState = false;
userid = 0;
username = '';
roles = '';
userGroups:string[] = [];
groupUsers:any[] = [];
permissions:string[] = [];


groups: GroupModel[] = [];
users: UserModel[] = [];

constructor(private httpClient: HttpClient, private commonModule:CommonModule, private router:Router, 
  private groupService: GroupService, private userService: UserService) {

  this.username = sessionStorage.getItem("username")!;
  this.userid = Number(sessionStorage.getItem("userid"));
  this.permissions = sessionStorage.getItem("roles") ? JSON.parse(sessionStorage.getItem("roles")!) : [];
  this.userGroups = sessionStorage.getItem("groups") ? JSON.parse(sessionStorage.getItem("groups")!): [];
}



ngOnInit() {
//console.log(this.permissions)
sessionStorage.getItem("roles")
  if (JSON.parse(sessionStorage.getItem("roles")!)[0] == "superAdmin") {
    this.isAdmin = true;
  }


  //get users groups
  


  //get groups
  this.getGroups()

  //get users
  

  this.groupUsers == this.users
}

getUsers(): void {
  this.userService.userFind().subscribe(data => {
    this.users = data;
  });
}

getGroups(): void {
  this.groupService.groupFind().subscribe(data => {
    this.groups = data;
    console.log("test")
  });
}

newGroup = {groupName:'', admins:[this.username], users:[this.username]};
addGroup() {
  this.groupService.groupInsert(this.newGroup);
}

showUsers(){
  this.userState = !this.userState; 
}



logOut() {
  sessionStorage.clear()
  this.router.navigateByUrl('/login');
}

get() {
  return this.username
}

delGroup(group: GroupModel){
  this.groupService.groupDelete({_id: group._id});
  console.log({_id: group._id});
  let i = this.groups.indexOf(group);
  this.groups.splice(i,1);
}

deleteProduct(group: GroupModel){
  this.groupService.groupDelete({_id: group._id});
  console.log({_id: group._id});
  let i = this.groups.indexOf(group);
  this.groups.splice(i,1);
}

join(){
  this.router.navigateByUrl('/chat');
}

makeAdmin(){
  let user = this.users
  console.log(user)
  this.httpClient.post<any>(BACKEND_URL + '/loginafter', user, httpOptions)
  .subscribe((data:any) => {

  })
}
}

