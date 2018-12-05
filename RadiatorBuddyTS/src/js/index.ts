import axios, {AxiosRequestConfig, AxiosPromise} from "axios";
import {Room} from "./room"
    
let baseURL: string = 'https://radiatorbuddy.azurewebsites.net/api';

let room = new Room;
let url = window.location.pathname;
let navigate = url.substring(url.lastIndexOf('/')+1)
let coll: HTMLCollection = <HTMLCollection> document.getElementsByClassName("collapsible")
let createroom: HTMLButtonElement = <HTMLButtonElement> document.getElementById("createroom")

function check(){
    if (navigate == "room.htm"){
        room.getMacadresses();
        room.getrooms();
    }
}

// createroom.addEventListener('click', function(){
    
// })

for(var i = 0; i < coll.length; i++){
    coll[i].addEventListener("click", function() {
        this.classList.toggle("active")
        var content = this.nextElementSibling;
        if (content.style.maxHeight){
            content.style.maxHeight = null;
        }
        else{
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
}

check();