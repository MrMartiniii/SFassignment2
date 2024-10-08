import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { GroupsComponent } from './groups/groups.component';
import { ChatComponent } from './chat/chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, GroupsComponent, ChatComponent, FormsModule, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})



export class AppComponent {
  title = 'Assignment';

  isSuperAdmin: boolean = false;
  constructor(private router:Router) {}

  ngOnInit(){
    this.router.navigateByUrl('/login');
  }

  logOut() {
    sessionStorage.clear()
    this.router.navigateByUrl('/login');
  }
}
