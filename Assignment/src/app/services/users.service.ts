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
}