import axios, {AxiosRequestConfig, AxiosPromise} from "axios";


export class Room{
    baseURL: string = 'https://radiatorbuddy.azurewebsites.net/api';
    macadresses: Array<string> = new Array<string>();
    sensorSelect: HTMLSelectElement = <HTMLSelectElement> document.getElementById("sensorselect");
    div: HTMLDivElement = <HTMLDivElement> document.getElementById("content");

    trimQuotes (string: string)
    {
        return string.replace(/['"]+/g, '');
    }

    getMacadresses(){
        let temparray: Array<string> = new Array<string>();
        axios.get(this.baseURL + '/sensorsdata')
        .then(function(responce){
            for(let d of responce.data){
                if(temparray.indexOf(d.id) === -1){
                    temparray.push(d.id)
                } 
            }
        });
        this.macadresses = temparray;
        console.log(this.macadresses)
    }

    compareMacAdresses(){
        let temparray: Array<string> = new Array<string>();
        temparray = this.macadresses;
        let index;
        axios.get(this.baseURL + '/sensorsdata/rooms')
        .then(function(responce){
            for(let i of responce.data){
                console.log(responce.data)
                index = temparray.indexOf(i);
                while(index !== -1){
                    temparray.splice(index, 1);
                    index = temparray.indexOf(i);
                }
            }
        })
        this.macadresses = temparray;
        console.log(this.macadresses)
    }

    setupCreate(){
        this.getMacadresses();
        this.compareMacAdresses();
        console.log(this.macadresses)   
        for(let i of this.macadresses){
            let op = this.sensorSelect.appendChild(document.createElement("option"));
            op.setAttribute("value", i);
            op.innerText = i.toString();
        }
    }

    

    async getrooms(){
        let tempdiv: HTMLDivElement = <HTMLDivElement> document.getElementById("thisdivthatdoesnotwork")
        await axios.get(this.baseURL + '/sensorsdata/rooms')
        .then(function(responce){
            for (let d of responce.data){
                let newbutton = tempdiv.appendChild(document.createElement("button"));
                newbutton.setAttribute("class", "collapsible")
                newbutton.innerText = JSON.stringify(d.location)
                let newdiv = tempdiv.appendChild(document.createElement("div"));
                newdiv.setAttribute("class", "content");
                let table = newdiv.appendChild(document.createElement("table"))
                table.setAttribute("id", "table")
                let thead = table.appendChild(document.createElement("thead"))
                thead.setAttribute("id", "tableitems")
        
                let trow = thead.appendChild(document.createElement("tr"))
                trow.appendChild(document.createElement("td")).innerHTML = "Room Name"
                let td = trow.appendChild(document.createElement("td"))
                td.appendChild(document.createElement("input")).innerHTML = JSON.stringify(d.location);

                trow = thead.appendChild(document.createElement("tr"))
                trow.appendChild(document.createElement("td")).innerHTML = "Sensor Mac-Adress"
                td = trow.appendChild(document.createElement("td"))
                td.appendChild(document.createElement("input")).innerHTML = JSON.stringify(d.MacAddress)

                trow = thead.appendChild(document.createElement("tr"))
                trow.appendChild(document.createElement("td")).innerHTML = "In or outdoor"
                td = trow.appendChild(document.createElement("td"))
                td.appendChild(document.createElement("input")).innerHTML = JSON.stringify(d.inDoor)
            }
        });
    }
    
}