import axios, {AxiosRequestConfig, AxiosPromise} from "axios";


export class Room{
    baseURL: string = 'https://radiatorbuddy.azurewebsites.net/api';
    macadresses: Array<string>;
    sensorSelect: HTMLSelectElement = <HTMLSelectElement> document.getElementById("sensorselect");
    div: HTMLDivElement = <HTMLDivElement> document.getElementById("content");
    lname: HTMLInputElement = <HTMLInputElement> document.getElementById("lname");
    InOrOut: HTMLSelectElement = <HTMLSelectElement> document.getElementById("inorout")
    roomarray: Array<string> = new Array<string>();

    trimQuotes (string: string)
    {
        return string.replace(/['"]+/g, '');
    }

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
                console.log(i.macAddress)
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
            console.log(this.macadresses[i])
            let op = document.createElement("option");
            this.sensorSelect.appendChild(op);
            op.setAttribute("value", this.macadresses[i]);
            op.innerText = this.macadresses[i].toString();
        }

    }

    posttodb(){
        axios.post(this.baseURL + '/sensorsdata/rooms', {
            MacAddress: this.sensorSelect.value,
            Location: this.lname.value,
            inDoor: this.InOrOut.value
        })
        alert("Rum oprettet")
    }
    

    async getrooms(){
        let tempdiv: HTMLDivElement = <HTMLDivElement> document.getElementById("roomdiv")
        let temparray: Array<string> = new Array<string>();
        let number: number = 0;
        let roomid: string = "roomid" + number;
        let tempid: string = "tempid" + number;
        let iuid: string = "iuid" + number;
        await axios.get(this.baseURL + '/sensorsdata/rooms')
        .then(function(responce){
            for (let d of responce.data){
                temparray.push(d.macAddress);
                let newbutton = tempdiv.appendChild(document.createElement("button"));
                newbutton.setAttribute("class", "collapsible")
                newbutton.innerText = JSON.stringify(d.location).replace(/['"]+/g, '')
                let newdiv = tempdiv.appendChild(document.createElement("div"));
                newdiv.setAttribute("class", "content");
                let table = newdiv.appendChild(document.createElement("table"))
                table.setAttribute("id", "table")
                let thead = table.appendChild(document.createElement("thead"))
                thead.setAttribute("id", "tableitems")
        
                let trow = thead.appendChild(document.createElement("tr"))
                trow.appendChild(document.createElement("td")).innerHTML = "Rum navn"
                let td = trow.appendChild(document.createElement("td"))
                let input = td.appendChild(document.createElement("input"))
                input.setAttribute("class", "input")
                input.setAttribute("id", roomid);
                input.setAttribute("placeholder", d.location);

                trow = thead.appendChild(document.createElement("tr"))
                trow.appendChild(document.createElement("td")).innerHTML = "Sensor Mac-Adress"
                td = trow.appendChild(document.createElement("td"))
                td.setAttribute("id", "mactext")
                td.innerHTML = d.macAddress

                trow = thead.appendChild(document.createElement("tr"))
                trow.appendChild(document.createElement("td")).innerHTML = "ind eller udenfor"
                td = trow.appendChild(document.createElement("td"))
                let select = td.appendChild(document.createElement("select"))
                select.setAttribute("id", iuid)
                if (d.inDoor === true){
                    let option = select.appendChild(document.createElement("option"))
                    option.setAttribute("value", "true")
                    option.innerText = "Ja";
                    option = select.appendChild(document.createElement("option"))
                    option.setAttribute("value", "false")
                    option.innerText = "Nej";
                }
                else{
                    let option = select.appendChild(document.createElement("option"))
                    option.setAttribute("value", "false")
                    option.innerText = "Nej";
                    option = select.appendChild(document.createElement("option"))
                    option.setAttribute("value", "true")
                    option.innerText = "Ja";
                }

                trow = thead.appendChild(document.createElement("tr"))
                trow.appendChild(document.createElement("td")).innerHTML = "Optimal Temperatur"
                td = trow.appendChild(document.createElement("td"))
                input = td.appendChild(document.createElement("input"))
                input.setAttribute("class", "input")
                input.setAttribute("type", "number")
                input.setAttribute("id", tempid)
                input.setAttribute("placeholder", d.optimalTemperature);

                let savebutton = newdiv.appendChild(document.createElement("button"))
                savebutton.setAttribute("class", "savebutton")
                
                savebutton.innerHTML = "Save"
                number++
                roomid = "roomid" + number;
                tempid = "tempid" + number;
                iuid = "iuid" + number;
            }
        });
        this.roomarray = temparray;

        console.log(this.roomarray);
    }
    
}