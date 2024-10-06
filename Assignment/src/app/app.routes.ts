import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { GroupsComponent } from './groups/groups.component';
import { ChatComponent } from './chat/chat.component';


export const routes: Routes = [
    {path: 'login',component:LoginComponent},
    {path: 'groups',component:GroupsComponent},
    {path: 'chat',component:ChatComponent}
];
