import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Peer from 'peerjs';

const SERVER_URL = 'http://localhost:3000';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
//private socket;
messagecontent:string='';
messages:string[]=[];
roomsnotice:string='';
currentroom:string='';
isinRoom=false;
newroom:string='';
nousers:number= 0;

//peer
peer: any;
peerId: string = '';
connectedPeer: any;
peerIds: { username: string, peerId: string }[] = []; // Array to store both username and Peer ID
@ViewChild('myVideo') myVideo!: ElementRef<HTMLVideoElement>;
@ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

constructor(private socketService:SocketService, private commonModule:CommonModule, private router:Router ) {}

ngOnInit() {
  this.initIoConnection();
  this.initPeer();

  // Emit the peer ID and username to the server when they are available
  const username = sessionStorage.getItem('username');
  this.peer.on('open', (id: string) => {
    console.log('My peer ID is:', id);
    this.peerId = id; // Store the peer ID

    if (username) {
      this.socketService.emit('peer-data', { username: username, peerId: id }); // Send username and Peer ID to the server
    }
  });

  // Listen for other users' peer data from the server
  this.socketService.onEvent('peer-data').subscribe((peerData: { username: string, peerId: string }) => {
    console.log('New peer connected:', peerData);
    // Check if the peer is already in the list and add only if it's not the current user
    const exists = this.peerIds.find(peer => peer.peerId === peerData.peerId);
    if (!exists && peerData.peerId !== this.peerId) {
      this.peerIds.push(peerData); // Add the new peer data (username and Peer ID) to the list
    }
  });
}

private scrollToBottom(): void {
  const messagesContainer = document.querySelector('.messages');
  if (messagesContainer) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

private initPeer(): void {
  // Create a new Peer instance
  this.peer = new Peer({
    host: 'localhost',
    port: 9000,
    path: '/myapp'
  });

  // Handle the open event to get the peer ID
  this.peer.on('open', (id: string) => {
    console.log('My peer ID is:', id);
    this.peerId = id; // Store the peer ID
    this.socketService.emit('peer-id', id); // Emit the peer ID to the server
  });

  // Handle incoming calls from other peers
  this.peer.on('call', (call: any) => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        call.answer(stream); // Answer the call with your video stream
        this.myVideo.nativeElement.srcObject = stream;
        this.myVideo.nativeElement.play();

        call.on('stream', (remoteStream: MediaStream) => {
          this.remoteVideo.nativeElement.srcObject = remoteStream;
          this.remoteVideo.nativeElement.play();
        });
      })
      .catch((err) => {
        console.error('Failed to get local stream', err);
      });
  });
}

connectToPeer(remotePeerId: string): void {
  const conn = this.peer.connect(remotePeerId);

  conn.on('open', () => {
    console.log('Connection opened to:', remotePeerId);
    this.connectedPeer = conn;

    conn.on('data', (data: any) => {
      console.log('Received data:', data);
      // Handle data received from the remote peer
    });

    conn.on('error', (error: Error) => {
      console.error('Peer connection error:', error);
    });
  });

  conn.on('error', (error: Error) => {
    console.error('Failed to connect to peer:', error);
  });
}

sendMessageToPeer(message: string): void {
  if (this.connectedPeer) {
    this.connectedPeer.send(message);
    console.log('Sent message:', message);
  } else {
    console.error('No connected peer to send the message');
  }
}

makeCall(remotePeerId: string): void {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
      const call = this.peer.call(remotePeerId, stream);
      this.myVideo.nativeElement.srcObject = stream;
      this.myVideo.nativeElement.play();

      call.on('stream', (remoteStream: MediaStream) => {
        this.remoteVideo.nativeElement.srcObject = remoteStream;
        this.remoteVideo.nativeElement.play();
      });

      call.on('error', (error: Error) => {
        console.error('Call error:', error);
      });
    })
    .catch((err) => {
      console.error('Failed to get local stream', err);
    });
}

private initIoConnection() {
  const username = sessionStorage.getItem('username'); // Retrieve the username from sessionStorage

  this.socketService.initSocket(); // Reinitialize the socket connection
  if (username) {
    this.socketService.sendJoinMessage(username); // Send the username to the server when connecting
  }

  this.socketService.getMessage().subscribe((m: any) => {
    this.messages.push(m);
    this.scrollToBottom(); // Scroll to the bottom when a new message is added
  });
}



chat() {
  const username = sessionStorage.getItem('username');

  if (this.messagecontent && username) {
    const messageData = {
      username:username,
      message: this.messagecontent
    };
  this.socketService.send(messageData);
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
