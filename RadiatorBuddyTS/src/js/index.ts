import axios, {AxiosRequestConfig, AxiosPromise} from "axios";
import {Room} from "./room"
    
let baseURL: string = 'https://radiatorbuddy.azurewebsites.net/api';

let room = new Room;
let url = window.location.pathname;
let navigate = url.substring(url.lastIndexOf('/')+1)
let coll: HTMLCollection = <HTMLCollection> document.getElementsByClassName("collapsible")
let savecoll: HTMLCollection = <HTMLCollection> document.getElementsByClassName("savebutton")
let createroom: HTMLButtonElement = <HTMLButtonElement> document.getElementById("createroom")
let homediv: HTMLDivElement = <HTMLDivElement> document.getElementById("homediv")

async function check(){
    if (navigate === "room.html"){
        //room.getMacadresses();
        await room.getrooms();
    }
    else if(navigate === "create.html"){
        room.setupCreate();
        createbutton();
    }  
    checkopenroom()
    checksave()
    //console.log(coll.length)
}

function createbutton(){
    createroom.addEventListener("click", function() {
        room.posttodb();
    })    
}

function checkopenroom(){
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
}

function checksave(){
    console.log(room.roomarray)
    for(let i = 0; i < savecoll.length; i++){
        savecoll[i].addEventListener("click", function(){
            console.log(i)
            let location: HTMLInputElement = <HTMLInputElement> document.getElementById("roomid" + i)
            console.log(location.id)
            let inorout: HTMLInputElement = <HTMLInputElement> document.getElementById("iuid" + i)
            console.log(inorout.id)
            let temperature: HTMLInputElement = <HTMLInputElement> document.getElementById("tempid" + i)
            console.log(temperature.id)
            if(location.value === null){
                location.value = location.placeholder;
            }
            if(temperature.value === null){
                temperature.value = temperature.placeholder;
            }
            axios.put(baseURL + '/sensorsdata/rooms', {
                macAddress: room.roomarray[i],
                location: location.value,
                inDoor: inorout.value,
                optimalTemperature: temperature.value
            })
        })
    }
}
checksave()
check()