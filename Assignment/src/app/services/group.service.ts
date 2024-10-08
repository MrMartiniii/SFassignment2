import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GroupModel } from "../Models";
import { query } from "express";

const httpOptions = {
    headers: new HttpHeaders({"Content-Type": "application/json"})
}

@Injectable({
    providedIn: 'root'
})
export class GroupService {
    url = 'http://localhost:8888'

    constructor(private http: HttpClient) { }

    groupInsert(group:any) {
        console.log(group);
        this.http.post(this.url + "/groupInsert", group, httpOptions)
            .subscribe(res => console.log("done"));
    }

    groupFind(){
        return this.http.get<GroupModel[]>(this.url + "/groupFind", httpOptions);
    }

    groupUpdate(groupQuery:any, groupUpdate:any){
        const queryUpdate = {query:groupQuery, update: groupUpdate}
        console.log(queryUpdate);
        return this.http.post(this.url + "/groupUpdate", queryUpdate)
    }

    groupDelete(group:any){
        console.log(group);
        this.http.post(this.url + "/groupDelete", group)
            .subscribe(res => console.log("done"))
    }
}