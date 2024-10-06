import { Component } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

const SERVER_URL = 'http://localhost:3000';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
//private socket;
messagecontent:string='';
messages:string[]=[];
roomsnotice:string='';
currentroom:string='';
isinRoom=false;
newroom:string='';
nousers:number= 0;

constructor(private socketService:SocketService, private commonModule:CommonModule, private router:Router ) {}

ngOnInit() {
  this.initIoConnection()
}

private initIoConnection(){
  this.socketService.getMessage().subscribe((m:any)=>{
    this.messages.push(m)
  });
}

chat() {
  if (this.messagecontent) {
    this.socketService.send(this.messagecontent);
    this.messagecontent = '';
  } else {
    console.log("no message");
  }
}

end(){
  this.socketService.leaveRoom();
  this.router.navigateByUrl('/groups')
}
}
