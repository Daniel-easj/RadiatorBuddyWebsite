import axios, {AxiosRequestConfig, AxiosPromise} from "axios";

export class Home{
    homeArray: Array<string> = new Array<string>();
    iArray: Array<string> = new Array<string>();
    uArray: Array<string> = new Array<string>();

    async getrooms(){
        let temparray: Array<string> = new Array<string>();
        await axios.get('https://radiatorbuddy.azurewebsites.net/api/sensorsdata/rooms')
        .then(function(respeonce){
            for(var i of respeonce.data){
                temparray.push((i.macAddress +  " " + i.inDoor))
            }
        })

        this.homeArray = temparray
        console.log(temparray)
        this.gettemps();
    }

    async gettemps(){
        let tempstring: string[]
        let temparray: Array<string> = new Array<string>();
        temparray = this.homeArray;
        let tempiarray: Array<string> = new Array<string>();
        let tempuarray: Array<string> = new Array<string>();

        await axios.get('https://radiatorbuddy.azurewebsites.net/api/sensorsdata')
        .then(function(respeonce){
            for(var i of respeonce.data){
                console.log(i.id)
                for(var d = 0; d < temparray.length; d++){
                    tempstring = temparray[d].split(' ');

                    if(tempstring[0] === i.id){
                        if(tempstring[1] === "true"){
                            tempiarray.push(("Temperatur: " + i.temperature + " Tidspunkt: " + i.timestamp))
                        }
                        else if(tempstring[1] === "false"){
                            tempuarray.push(("Temperatur: " + i.temperature + " Tidspunkt: " + i.timestamp))
                        }
                    }
                }
            }
        })   
        this.iArray = tempiarray;
        this.uArray = tempuarray; 

        this.setuplists()
        this.setuptop();
    }

    async setuptop(){
        let table: HTMLTableElement = <HTMLTableElement> document.getElementById("toptable")
        let tempilist: Array<number> = new Array<number>();
        let tempulist: Array<number> = new Array<number>();
        let split: string[]
        let inumber: number;
        let unumber: number;

        for(var i in this.iArray){
            split = this.iArray[i].split(' ')
            tempilist.push(Number(split[1]))
        }

        for(var i in this.uArray){
            split = this.uArray[i].split(' ')
            tempulist.push(Number(split[1]))
        }

        inumber = tempilist.reduce(function(acc, val){
            return acc + val;
        }, 0)

        inumber = inumber / tempilist.length;
        console.log(inumber)

        unumber = tempulist.reduce(function(acc, val){
            return acc + val;
        }, 0)

        unumber = unumber / tempulist.length;
        console.log(unumber)

        let tr = table.appendChild(document.createElement("tr"))
        let td = tr.appendChild(document.createElement("td"))
        td.setAttribute("class", "toptd")
        td.innerHTML = inumber.toFixed(2)

        td = tr.appendChild(document.createElement("td"))
        td.setAttribute("class", "toptd")
        td.innerHTML = unumber.toFixed(2)

        await axios.get('https://radiatorbuddy.azurewebsites.net/api/weatherdata/today')
        .then(function(respeonce){
            td = tr.appendChild(document.createElement("td"))
            td.setAttribute("class", "toptd")
            td.innerHTML = respeonce.data
        })

        tr = table.appendChild(document.createElement("tr"))
        td = tr.appendChild(document.createElement("td"))
        td.setAttribute("class", "buttomtd1")
        td.innerHTML = "Gennemsnitslig inde temp"
        td = tr.appendChild(document.createElement("td"))
        td.setAttribute("class", "buttomtd1")
        td.innerHTML = "Gennemsnitslig ude temp"
        td = tr.appendChild(document.createElement("td"))
        td.setAttribute("class", "buttomtd1")
        td.innerHTML = "Gennemsnitslig vejr temp"
    }

    setuplists(){
        let utable: HTMLTableElement = <HTMLTableElement> document.getElementById("utable")
        let itable: HTMLTableElement = <HTMLTableElement> document.getElementById("itable")
        let isplit: string[]
        let usplit: string[]

        for(var i in this.iArray){
            isplit = this.iArray[i].split(' ')
            let tr1 = itable.appendChild(document.createElement("tr"))
            let td = tr1.appendChild(document.createElement("td"))
            td.setAttribute("class", "buttomtd1")
            td.innerHTML = isplit[0] + ' ' + Number(isplit[1]).toFixed(2)

            let tr2 = itable.appendChild(document.createElement("tr"))
            td = tr2.appendChild(document.createElement("td"))
            td.setAttribute("class", "buttomtd2")
            td.innerHTML = isplit[2] + ' ' + isplit[3].replace('T', ' ')
        }

        for(var i in this.uArray){
            usplit = this.uArray[i].split(' ')
            let tr1 = utable.appendChild(document.createElement("tr"))
            let td = tr1.appendChild(document.createElement("td"))
            td.setAttribute("class", "buttomtd1")
            td.innerHTML = usplit[0] + ' ' + Number(usplit[1]).toFixed(2) 

            let tr2 = utable.appendChild(document.createElement("tr"))
            td = tr2.appendChild(document.createElement("td"))
            td.setAttribute("class", "buttomtd2")
            td.innerHTML = usplit[2] + ' ' + usplit[3].replace('T', ' ')
        }
    }
}