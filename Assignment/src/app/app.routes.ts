import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { GroupsComponent } from './groups/groups.component';
import { ChatComponent } from './chat/chat.component';
import { UsersComponent } from './users/users.component';
import { ProfileComponent } from './profile/profile.component';
import { UserEditComponent } from './user-edit/user-edit.component';


export const routes: Routes = [
    {path: 'login',component:LoginComponent},
    {path: 'groups',component:GroupsComponent},
    {path: 'chat',component:ChatComponent},
    {path: 'users',component:UsersComponent},
    {path: 'profile',component:ProfileComponent},
    {path: 'user-edit',component:UserEditComponent}
];
