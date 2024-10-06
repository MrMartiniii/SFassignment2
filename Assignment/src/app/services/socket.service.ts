import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import io from 'socket.io-client';

const SERVER_URL = 'http://localhost:8888/chat';

@Injectable({
    providedIn: 'root'
})

export class SocketService {
public socket: any;
public socketId: any;
constructor () {this.socket = io(SERVER_URL)}

initSocket(): void{
    ;
}

getMessage(){
    return new Observable(observer=>{
        this.socket.on('message',(data:string)=>{
            observer.next(data)
        });
    });
}

send(message:string){
    this.socket.emit('message',message);
}

leaveRoom(){
    this.socket.disconnect()
}

}
