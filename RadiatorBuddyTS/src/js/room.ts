import axios, {AxiosRequestConfig, AxiosPromise} from "axios";


export class Room{
    private baseURL: string = 'https://radiatorbuddy.azurewebsites.net/api';
    private roomdiv: HTMLDivElement = <HTMLDivElement> document.getElementById("roomcollection")
    private macadresses: string[];

    //div: HTMLDivElement = <HTMLDivElement> document.getElementById("content");

    // trimQuotes (string: string)
    // {
    //     return string.replace(/['"]+/g, '');
    // }

    constructor(){
        this.macadresses = new Array<string>();
        axios.get(this.baseURL + '/sensorsdata/1')
        .then(function(responce){
            this.macadresses = [responce.data.MacAddress]
        });
    }

    async getMacadresses(){

    }

    getrooms(){
        axios.get(this.baseURL + '/sensorsdata/rooms')
        .then(function(responce){
            for (let d in responce.data){
                let newbutton = this.roomdiv.appendChild(document.createElement("button"));
                newbutton.setAttribute("class", "collapsible")
                newbutton.innerText = "new room"
                let newdiv = this.roomdiv.appendChild(document.createElement("div"));
                newdiv.setAttribute("class", "content");
                let table = newdiv.appendChild(document.createElement("table"))
                table.setAttribute("id", "table")
                let thead = table.appendChild(document.createElement("thead"))
                thead.setAttribute("id", "tableitems")
        
                let trow = thead.appendChild(document.createElement("tr"))
                trow.appendChild(document.createElement("td")).innerHTML = "Room Name"
                let td = trow.appendChild(document.createElement("td"))
                td.appendChild(document.createElement("input")).innerHTML = d.Location;

                trow = thead.appendChild(document.createElement("tr"))
                trow.appendChild(document.createElement("td")).innerHTML = "Sensor Mac-Adress"
                td = trow.appendChild(document.createElement("td"))
                td.appendChild(document.createElement("input")).innerHTML = JSON.stringify(d.MacAddress)
            }
        });
    }
    
}