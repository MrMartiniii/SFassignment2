import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserModel } from '../Models';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../services/users.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  isAdmin = false;
  user: UserModel = {username:'', email:'', password:'', roles:[], groups:[]}

  profileImageUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  username: string = ''

  constructor(private router:Router, private http:HttpClient, private userService:UserService)  { }

  ngOnInit(){
    sessionStorage.getItem("roles")
    if (JSON.parse(sessionStorage.getItem("roles")!)[0] == "superAdmin") {
      this.isAdmin = true;
    }
    this.getUsername();
    this.getProfilePicture();
  }


  editUser(){

  }

  editPassword(){

  }



  getUsername(): void {
    // Assuming the username is stored in session storage when the user logs in
    const storedUsername = sessionStorage.getItem('username');
    console.log('Fetched username from session storage:', storedUsername);
    if (storedUsername) {
      this.username = storedUsername;
    } else {
      console.error('Username not found in session storage');
    }
  }

  getProfilePicture(): void {
    if (this.username) {
        this.userService.getProfilePicture(this.username).subscribe(
            (response: any) => {
                // Use the server URL to access the image
                this.profileImageUrl = response.filePath ? `http://localhost:8888/${response.filePath}` : 'assets/default-avatar.png';
            },
            (error) => {
                console.error('Error fetching profile picture:', error);
                this.profileImageUrl = 'assets/default-avatar.png'; // Display a default image if there's an error
            }
        );
    }
}

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];

      // Display the image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImageUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);

      this.uploadProfilePicture(); // Automatically upload the image after selection
    }
  }

  uploadProfilePicture(): void {
    console.log(this.username)
    if (this.selectedFile && this.username) {

        this.userService.uploadProfilePicture(this.username, this.selectedFile).subscribe(
            (response: any) => {
                console.log('Profile picture uploaded successfully:', response);
                this.getProfilePicture();
            },
            (error) => {
                console.error('Error uploading profile picture:', error);
            }
        );
    } else {
        console.error('No file selected or username is missing');
    }
}

  logOut() {
    sessionStorage.clear()
    this.router.navigateByUrl('/login');
  }
}
