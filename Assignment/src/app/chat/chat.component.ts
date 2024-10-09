import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import Peer from 'peerjs';
import { UserService } from '../services/users.service';

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
messages: any[] = [];
roomsnotice:string='';
currentroom: string = '';
isinRoom=false;
newroom:string='';
nousers:number= 0;

profileImageUrl: string | null = null;
username: string = '';
isProfilePictureLoaded: boolean = false;

//peer
isInCall: boolean = false;
peer: any;
peerId: string = '';
connectedPeer: any;
remotePeerName: string = '';
peerIds: { username: string, peerId: string }[] = []; // Array to store both username and Peer ID
@ViewChild('myVideo') myVideo!: ElementRef<HTMLVideoElement>;
@ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

constructor(private socketService:SocketService, private commonModule:CommonModule, private router:Router, private userService: UserService, private route: ActivatedRoute, ) {}

ngOnInit() {
  // Get the group and channel from query parameters when the component initializes
  this.route.queryParams.subscribe(params => {
    const group = params['group'];
    const channel = params['channel'];
    if (group && channel) {
      this.currentroom = `${group}-${channel}`; // Create a unique room identifier based on group and channel
      console.log(`Joining room: ${this.currentroom}`);

      this.getUsernameAndProfilePic(); // Load the user's profile picture first
      this.initPeer(); // Initialize the peer connection first

      // Only initialize the socket connection once after peer connection is ready
      this.peer.on('open', (id: string) => {
        console.log('My peer ID is:', id);
        this.peerId = id; // Store the peer ID
        this.initIoConnection(); // Initialize the socket connection and join the room after peer ID is set
      });
    }
  });
}

private initIoConnection() {
  // Reinitialize the socket connection to ensure only one instance
  this.socketService.initSocket();

  // Emit the join event with the room and username when a new user connects
  const username = sessionStorage.getItem('username');
  if (username && this.currentroom) {
    // Emit the join event to the server
    this.socketService.emit('join', { room: this.currentroom, username: username, peerId: this.peerId });
    console.log(`Join event emitted with username: ${username}, Peer ID: ${this.peerId}, and Room: ${this.currentroom}`);
  }

  // Listen for the message history from the server
  this.socketService.onEvent('message-history').subscribe((history: any[]) => {
    this.messages = history.concat(this.messages); // Prepend message history to the existing messages
    this.scrollToBottom(); // Scroll to the latest message
  });

  // Listen for peer list updates from the server
  this.socketService.onEvent('peer-list').subscribe((peerList: { username: string, peerId: string }[]) => {
    this.peerIds = peerList.filter(peer => peer.peerId !== this.peerId);
    console.log('Updated peer list:', this.peerIds); // Debug log to ensure the list is received
  });

  // Listen for other users' peer data from the server
  this.socketService.onEvent('peer-data').subscribe((peerData: { username: string, peerId: string }) => {
    console.log('New peer connected:', peerData);
    const exists = this.peerIds.find(peer => peer.peerId === peerData.peerId);
    if (!exists && peerData.peerId !== this.peerId) {
      this.peerIds.push(peerData); // Add the new peer data (username and Peer ID) to the list
    }
  });

  // Listen for new incoming messages
  this.socketService.getMessage().subscribe((messageData: any) => {
    console.log('Received message:', messageData); // Debug log
    this.messages.push(messageData);
    this.scrollToBottom();
  });
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
    console.log('Incoming call from:', call.peer);
    this.handleIncomingCall(call);
  });
}

private handleIncomingCall(call: any): void {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
      call.answer(stream); // Answer the call with your video stream
      this.myVideo.nativeElement.srcObject = stream;
      this.myVideo.nativeElement.play();

      // Store the incoming call object in connectedPeer
      this.connectedPeer = call;

      call.on('stream', (remoteStream: MediaStream) => {
        console.log('Received remote stream');
        this.remoteVideo.nativeElement.srcObject = remoteStream;
        this.remoteVideo.nativeElement.play();
      });

      call.on('close', () => {
        console.log('The call has ended.');
        this.cleanupVideoStreams();
        this.isInCall = false;
      });

      call.on('error', (error: Error) => {
        console.error('Call error:', error);
        this.isInCall = false;
      });
    })
    .catch((err) => {
      console.error('Failed to get local stream', err);
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
      console.log('Calling peer:', remotePeerId);
      const call = this.peer.call(remotePeerId, stream);
      this.myVideo.nativeElement.srcObject = stream;
      this.myVideo.nativeElement.play();

      // Store the call object in connectedPeer to manage it later
      this.connectedPeer = call;
      this.isInCall = true;

      call.on('stream', (remoteStream: MediaStream) => {
        console.log('Received remote stream on my side');
        this.remoteVideo.nativeElement.srcObject = remoteStream;
        this.remoteVideo.nativeElement.play();
      });

      call.on('close', () => {
        console.log('The call has ended.');
        this.cleanupVideoStreams();
        this.isInCall = false; // Reset to false when the call ends
      });

      call.on('error', (error: Error) => {
        console.error('Call error:', error);
        this.isInCall = false; // Reset to false if an error occurs
      });
    })
    .catch((err) => {
      console.error('Failed to get local stream', err);
    });
}

private cleanupVideoStreams(): void {
  // Stop all media tracks to properly end the video call
  const localStream = this.myVideo.nativeElement.srcObject as MediaStream;
  localStream?.getTracks().forEach(track => track.stop());

  const remoteStream = this.remoteVideo.nativeElement.srcObject as MediaStream;
  remoteStream?.getTracks().forEach(track => track.stop());

  // Reset the video elements
  this.myVideo.nativeElement.srcObject = null;
  this.remoteVideo.nativeElement.srcObject = null;

  this.connectedPeer = null; // Clear the connected peer information
}

endCall(): void {
  if (this.connectedPeer) {
    this.connectedPeer.close(); // Close the data connection
    console.log('Peer connection closed.');
    this.cleanupVideoStreams();
    this.isInCall = false; // Set to false when the call ends
  } else {
    console.log('No active call to disconnect.');
  }
}

getUsernameAndProfilePic(): void {
  // Retrieve the username and profile picture URL from session storage
  this.username = sessionStorage.getItem('username') || 'Unknown User';
  this.getProfilePicture();
}

getProfilePicture(): void {
  if (this.username) {
    console.log('Fetching profile picture for username:', this.username); // Debug log
    this.userService.getProfilePicture(this.username).subscribe(
      (response: any) => {
        console.log('Profile picture response:', response); // Debug log
        this.profileImageUrl = response.filePath ? `http://localhost:8888/${response.filePath}` : 'assets/default-avatar.png';
        console.log('Profile image URL set to:', this.profileImageUrl); // Debug log
        this.isProfilePictureLoaded = true;
      },
      (error) => {
        console.error('Error fetching profile picture:', error);
        this.profileImageUrl = 'assets/default-avatar.png';
        this.isProfilePictureLoaded = true;
      }
    );
  }
}

chat() {
  if (this.messagecontent && this.username && this.isProfilePictureLoaded) {
    const messageData: {
      room: string;
      username: string;
      message: string;
      profilePicture?: string; // Marked as optional to align with the expected parameter type
    } = {
      room: this.currentroom,
      username: this.username,
      message: this.messagecontent,
    };

    // Conditionally add the profilePicture property if it is available
    if (this.profileImageUrl) {
      messageData.profilePicture = this.profileImageUrl;
    }

    this.socketService.send(messageData);
    this.messagecontent = '';
  } else {
    console.log("No message content, username missing, or profile picture not loaded");
  }
}



private scrollToBottom(): void {
  const messagesContainer = document.querySelector('.messages');
  if (messagesContainer) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

onImageSelected(event: any): void {
  const file: File = event.target.files[0];
  if (file) {
    this.userService.uploadChatImage(file).subscribe(
      (response: any) => {
        const imageUrl = `http://localhost:8888/${response.filePath}`;
        const imageMessage: {
          room: string;
          username: string;
          message: string;
          profilePicture?: string; // Marked as optional
          imageUrl?: string; // Marked as optional
        } = {
          room: this.currentroom,
          username: this.username,
          message: '' // Optional: you could include a message or leave it empty
        };

        // Conditionally add the profilePicture and imageUrl properties if they are available
        if (this.profileImageUrl) {
          imageMessage.profilePicture = this.profileImageUrl;
        }
        if (imageUrl) {
          imageMessage.imageUrl = imageUrl;
        }

        this.socketService.send(imageMessage);
      },
      (error) => {
        console.error('Error uploading image:', error);
      }
    );
  }
}

end(){
  if (this.connectedPeer) {
    this.connectedPeer.close(); // Close the data connection
    console.log('Peer connection closed.');
    this.cleanupVideoStreams();
  }
  this.socketService.leaveRoom();
  this.router.navigateByUrl('/groups')
}
}
