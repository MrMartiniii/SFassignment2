import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';

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
groups: any[]=[];
users: any[]=[];
userid = 0;
username = '';
roles = '';
userGroups:string[] = [];
groupUsers:any[] = [];
permissions:string[] = [];

constructor(private httpClient: HttpClient, private commonModule:CommonModule, private router:Router) {

  this.username = sessionStorage.getItem("username")!;
  this.userid = Number(sessionStorage.getItem("userid"));
  this.permissions = JSON.parse(sessionStorage.getItem("roles")!);

  this.userGroups = JSON.parse(sessionStorage.getItem("groups")!);
}



ngOnInit() {
console.log(this.permissions)

  if (JSON.parse(sessionStorage.getItem("roles")!)[0] == "SuperAdmin") {
    this.isAdmin = true;
  }


  //get users groups
  this.httpClient.get<any[]>(BACKEND_URL + '/loginAfter').subscribe((data:any[]) => {
    this.groupUsers = data;
    console.log(this.groupUsers)
  },
  error => {
    console.error("error fetching items", error);
  });


  //get groups
 this.httpClient.get<any[]>(BACKEND_URL + '/groups').subscribe(data => {
    this.groups = data;
  },
  error => {
    console.error("error fetching items", error);
  });

  //get users
  this.httpClient.get<any[]>(BACKEND_URL + '/loginAfter').subscribe(data => {
    this.users = data;
    console.log(this.users)
  },
  error => {
    console.error("error fetching items", error);
  });

  this.groupUsers == this.users
}


  newGroup = '';
  
addGroup() {
  let groupObj = {
    "groupName":this.newGroup,
    "admins":[this.username]
  }

  this.httpClient.post<any>(BACKEND_URL + '/groups', groupObj, httpOptions)
  .subscribe((a: any) => {alert(JSON.stringify(a));
  });

  this.httpClient.get<any[]>(BACKEND_URL + '/groups').subscribe(data => {
    this.groups = data;
    console.log(data);
  },
  error => {
    console.error("error fetching items", error);
  });
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

delGroup(id: string, index: number): void {
  
  this.groups.splice(index,1)
  console.log(this.groups)
  this.httpClient.delete(BACKEND_URL + '/groups',httpOptions)
  .subscribe((data) => {
    data = this.groups.splice(index,1);
  });
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

