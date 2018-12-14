import axios, {AxiosRequestConfig, AxiosPromise} from "axios";
import {Settings} from './settings'

export class Create{
    baseURL: string = 'https://radiatorbuddy.azurewebsites.net/api';
    macadresses: Array<string>;
    sensorSelect: HTMLSelectElement = <HTMLSelectElement> document.getElementById("sensorselect");
    lname: HTMLInputElement = <HTMLInputElement> document.getElementById("lname");
    InOrOut: HTMLSelectElement = <HTMLSelectElement> document.getElementById("inorout")

    async getMacadresses(){
        let temparray: Array<string> = new Array<string>();
        this.macadresses = new Array<string>();
        await axios.get(this.baseURL + '/sensorsdata')
        .then(function(responce){
            for(let d of responce.data){
                if(temparray.indexOf(d.id) === -1){
                    temparray.push(d.id)
                } 
            }
        });
        this.macadresses = temparray;
    }

    async compareMacAdresses(){
        let temparray: Array<string> = new Array<string>();
        temparray = this.macadresses;
        let index;
        await axios.get(this.baseURL + '/sensorsdata/rooms')
        .then(function(responce){
            for(let i of responce.data){
                index = temparray.indexOf(i.macAddress);
                while(index !== -1){
                    temparray.splice(index, 1);
                    index = temparray.indexOf(i.macAddress);
                }
            }
        })
        this.macadresses = temparray;
    }

    async setupCreate(){        
        await this.getMacadresses();
        await this.compareMacAdresses();
        for(let i in this.macadresses){
            let op = document.createElement("option");
            this.sensorSelect.appendChild(op);
            op.setAttribute("value", this.macadresses[i]);
            op.innerText = this.macadresses[i].toString();
        }

    }

    async posttodb(){
        let totemp: string;
        let tmatemp: string;
        let tmitemp: string;
        await axios.get('https://radiatorbuddy.azurewebsites.net/api/rbuddyusers')
        .then(function(responce){
            for(let i of responce.data){
                totemp = i.globalOptimalTemperature
                tmatemp = i.globalMaxTemperature
                tmitemp = i.globalMinTemperature
            }
        })
        console.log(totemp)

        axios.post(this.baseURL + '/sensorsdata/rooms', {
            MacAddress: this.sensorSelect.value,
            Location: this.lname.value,
            InDoor: this.InOrOut.value, 
            OptimalTemperature: totemp,
            MinTemperature: tmitemp,
            MaxTemperature: tmatemp
        })
            alert("Rum oprettet")
    }
}