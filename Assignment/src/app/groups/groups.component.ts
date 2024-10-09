import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
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
  imports: [FormsModule, CommonModule, RouterLink],
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
newChannelNames: string[] = [];
selectedChannels: string[] = [];

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

    // Set the default selected channel for each group to the first one
    this.groups.forEach((group, index) => {
      this.selectedChannels[index] = group.channels ? group.channels[0] : ''; // Default to the first channel or an empty string if no channels exist
      this.newChannelNames[index] = ''; // Initialize the new channel name for each group to an empty string
    });
  });
}
newGroup = {groupName:'', admins:[this.username], users:[this.username]};
addGroup() {
  if (this.newGroup.groupName) {
    this.groupService.groupInsert(this.newGroup).subscribe(response => {
      console.log('Group added:', response);
      this.groups.push(response); // Add the new group to the existing list without needing to refresh
      this.newGroup = { groupName: '', admins: [this.username], users: [this.username] }; // Reset the input fields
    }, error => {
      console.error('Error adding group:', error);
    });
  }
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


makeAdmin(){
  let user = this.users
  console.log(user)
  this.httpClient.post<any>(BACKEND_URL + '/loginafter', user, httpOptions)
  .subscribe((data:any) => {

  })
}

selectedChannel = '';

join(groupIndex: number): void {
  const group = this.groups[groupIndex];
  const selectedChannel = this.selectedChannels[groupIndex];

  if (group && selectedChannel) {
    this.router.navigate(['/chat'], { queryParams: { group: group.groupName, channel: selectedChannel } });
  } else {
    console.log('Group or channel not selected.');
  }
}

addChannel(groupName: string, groupIndex: number): void {
  const newChannelName = this.newChannelNames[groupIndex]; // Get the specific channel name for the group
  if (newChannelName) {
    this.groupService.addChannel(groupName, newChannelName).subscribe(response => {
      console.log('Channel added:', response);
      this.getGroups(); // Refresh the group list to show the new channel
      this.newChannelNames[groupIndex] = ''; // Clear the input field for the specific group
    }, error => {
      console.error('Error adding channel:', error);
    });
  }
}


deleteChannel(groupName: string, channelToDelete: string): void {
  this.groupService.deleteChannel(groupName, channelToDelete).subscribe(response => {
    console.log('Channel deleted:', response);
    this.getGroups(); // Refresh the group list to reflect the deleted channel
  }, error => {
    console.error('Error deleting channel:', error);
  });
}
}

