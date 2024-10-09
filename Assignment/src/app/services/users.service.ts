import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserModel } from "../Models";
import { query } from "express";
import { Observable } from "rxjs";

const httpOptions = {
    headers: new HttpHeaders({"Content-Type": "application/json"})
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    url = 'http://localhost:8888'

    constructor(private http: HttpClient) { }

    userInsert(user:any) {
        console.log(user);
        this.http.post(this.url + "/userInsert", user, httpOptions)
            .subscribe(res => console.log("done"));
        return this.http.post(`${this.url}/login`, user)
    }

    userFind(){
        return this.http.get<UserModel[]>(this.url + "/userFind", httpOptions);
    }

    userUpdate(userQuery:any, userUpdate:any){
        const queryUpdate = {query:userQuery, update: userUpdate}
        console.log(queryUpdate);
        return this.http.post(this.url + "/userUpdate", queryUpdate)
    }

    userDelete(user:any){
        console.log(user);
        this.http.post(this.url + "/userDelete", user)
            .subscribe(res => console.log("done"))
    }

    userLogin(user: {username: string, password: string}) :Observable<any> {
        return this.http.post(`${this.url}/login`, user)
    }

    uploadProfilePicture(username: string, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('profilePicture', file);
        formData.append('username', username); // Send the username along with the file
    
        return this.http.post(`${this.url}/uploadProfilePicture`, formData);
    }

    getProfilePicture(username: string): Observable<any> {
        return this.http.get(`${this.url}/getProfilePicture?username=${username}`);
    }

    uploadChatImage(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('image', file); // 'image' is the key expected by the server
    
        return this.http.post(`${this.url}/uploadChatImage`, formData);
    }    
}