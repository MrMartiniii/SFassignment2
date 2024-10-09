import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import io from 'socket.io-client';

const SERVER_URL = 'http://localhost:8888/chat'; // Ensure this matches the port of your Socket.IO server

@Injectable({
    providedIn: 'root'
})

export class SocketService {
    public socket: any;

    constructor() {
        this.socket = io(SERVER_URL); // Connect to the main Socket.IO server
    }

    initSocket(): void {
        if (this.socket && this.socket.connected) {
          this.socket.disconnect(); // Disconnect any existing socket to avoid conflicts
        }
        this.socket = io(SERVER_URL); // Create a new socket connection
      }

      
    getMessage() {
        return new Observable(observer => {
            this.socket.on('message', (data: string) => {
                observer.next(data);
            });
        });
    }
    
    send(messageData: { room: string; username: string; message: string; profilePicture?: string; imageUrl?: string }): void {
      this.socket.emit('message', messageData);
    }
    
    

    leaveRoom(): void {
        if (this.socket) {
          this.socket.disconnect(); // Properly disconnect the socket
          console.log('User has left the room and the socket has been disconnected');
        }
      }
      

    sendJoinMessage(username: string): void {
        this.socket.emit('join', username);
      }

      emit(eventName: string, data: any): void {
        this.socket.emit(eventName, data);
      }
      
      onEvent(eventName: string): Observable<any> {
        return new Observable((observer) => {
          this.socket.on(eventName, (data: any) => {
            observer.next(data);
          });
        });
      }
}
