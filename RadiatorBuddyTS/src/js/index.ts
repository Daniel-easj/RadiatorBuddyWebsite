import axios, {AxiosRequestConfig, AxiosPromise} from "axios";
import {Room} from "./room"
import {Create} from "./create"
import {Settings} from "./settings"
import {Home} from "./home"
    
let baseURL: string = 'https://radiatorbuddy.azurewebsites.net/api';

let room = new Room;
let create = new Create;
let settings = new Settings;
let home = new Home;
let url = window.location.pathname;
let navigate = url.substring(url.lastIndexOf('/')+1)
let createroom: HTMLButtonElement = <HTMLButtonElement> document.getElementById("createroom")
let gbutton: HTMLButtonElement = <HTMLButtonElement> document.getElementById("Settingssave")
let homediv: HTMLDivElement = <HTMLDivElement> document.getElementById("homediv")

async function check(){
    if (navigate === "room.html"){
        await room.getrooms();
        room.checkopenroom()
        room.checksave()
        room.checkdelete()
    }
    else if(navigate === "create.html"){
        create.setupCreate();
        createbutton();
    }  
    else if(navigate === "Settings.html"){
        settings.getudata();
        globalbutton();
    }
    else if(navigate === "index.htm"){
        await home.getrooms()
    }

}

function createbutton(){
    createroom.addEventListener("click", function() {
        create.posttodb();
    })    
}

function globalbutton(){
    gbutton.addEventListener("click", function(){
        settings.setglobltemps();
    })
}

check()