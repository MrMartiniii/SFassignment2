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

    groupInsert(newGroup: any) {
        return this.http.post<any>(`${this.url}/groupInsert`, newGroup, httpOptions);
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

    addChannel(groupName: string, newChannel: string) {
        return this.http.post<any>(`${this.url}/addChannel`, { groupName, newChannel }, httpOptions);
      }
      
      deleteChannel(groupName: string, channelToDelete: string) {
        return this.http.post<any>(`${this.url}/deleteChannel`, { groupName, channelToDelete }, httpOptions);
      }
}