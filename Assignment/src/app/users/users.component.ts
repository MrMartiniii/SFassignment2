import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/users.service';
import { UserModel } from '../Models';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  users: UserModel[] = []


  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.userFind().subscribe(data => {
      this.users = data;
    });
  }

  deleteUser(user: UserModel){
    this.userService.userDelete({_id: user._id});
    console.log({_id: user._id});
    let i = this.users.indexOf(user);
    this.users.splice(i,1);
  }

  updateUser(user: UserModel){
    delete user._id;
    sessionStorage.setItem("user", JSON.stringify(user));
    this.router.navigate(['user-edit']);
  }

  
logOut() {
  sessionStorage.clear()
  this.router.navigateByUrl('/login');
}

}
