import axios, { AxiosRequestConfig, AxiosPromise } from "axios";

export class Room {
    baseURL: string = 'https://radiatorbuddy.azurewebsites.net/api';
    macadresses: Array<string>;
    sensorSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById("sensorselect");
    div: HTMLDivElement = <HTMLDivElement>document.getElementById("content");
    roomarray: Array<string> = new Array<string>();
    coll: HTMLCollection = <HTMLCollection>document.getElementsByClassName("collapsible")
    savecoll: HTMLCollection = <HTMLCollection>document.getElementsByClassName("savebutton")
    deletecoll: HTMLCollection = <HTMLCollection>document.getElementsByClassName("deletebutton")

    checkopenroom() {
        for (var i = 0; i < this.coll.length; i++) {
            this.coll[i].addEventListener("click", function () {
                this.classList.toggle("active")
                var content = this.nextElementSibling;
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                }
                else {
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            });
        }
    }

    checksave() {
        for (let i = 0; i < this.savecoll.length; i++) {
            console.log(this.roomarray.length)
            this.savecoll[i].addEventListener("click", function () {
                let location: HTMLInputElement = <HTMLInputElement>document.getElementById("roomid" + i)
                let inorout: HTMLSelectElement = <HTMLSelectElement>document.getElementById("iuid" + i)
                let optimaltemperature: HTMLInputElement = <HTMLInputElement>document.getElementById("otempid" + i)
                let mintemperature: HTMLInputElement = <HTMLInputElement>document.getElementById("mitempid" + i)
                let maxtemperature: HTMLInputElement = <HTMLInputElement>document.getElementById("matempid" + i)
                let macid: HTMLTableElement = <HTMLTableElement> document.getElementById("macid" + i)

                if (location.value === '') {
                    location.value = location.placeholder;
                }
                if (optimaltemperature.value === '') {
                    optimaltemperature.value = optimaltemperature.placeholder;
                }
                if (maxtemperature.value === '') {
                    maxtemperature.value = maxtemperature.placeholder;
                }
                if (mintemperature.value === '') {
                    mintemperature.value = mintemperature.placeholder;
                }
                if (maxtemperature.value < optimaltemperature.value) {
                    maxtemperature.value = maxtemperature.placeholder
                }
                if (mintemperature.value > optimaltemperature.value) {
                    mintemperature.value = mintemperature.placeholder
                }
                if (optimaltemperature.value > maxtemperature.value || optimaltemperature.value < mintemperature.value) {
                    optimaltemperature.value = optimaltemperature.placeholder
                }

                console.log(i)
                console.log(macid.textContent)

                axios.put('https://radiatorbuddy.azurewebsites.net/api//sensorsdata/rooms', {
                    MacAddress: macid.textContent,
                    Location: location.value,
                    InDoor: inorout.value,
                    OptimalTemperature: optimaltemperature.value,
                    MinTemperature: mintemperature.value,
                    MaxTemperature: maxtemperature.value
                })
                .then(function(){
                    window.location.reload();
                })
            })
        }
    }

    checkdelete() {
        for (let i = 0; i < this.deletecoll.length; i++) {
            this.deletecoll[i].addEventListener("click", function () {
                let macid: HTMLTableElement = <HTMLTableElement> document.getElementById("macid" + i)
                axios({
                    method: 'DELETE',
                    url: 'https://radiatorbuddy.azurewebsites.net/api//sensorsdata/rooms',
                    data: {
                        MacAddress: macid.textContent
                    }
                })
                    .then(function () {
                        window.location.reload();
                    })

            })
        }
    }

    async getrooms() {
        let tempdiv: HTMLDivElement = <HTMLDivElement>document.getElementById("roomdiv")
        let temparray: Array<string> = new Array<string>();
        let number: number = 0;
        let macid: string = "macid" + number;
        let roomid: string = "roomid" + number;
        let otempid: string = "otempid" + number;
        let iuid: string = "iuid" + number;
        let mitempid: string = "mitempid" + number;
        let matempid: string = "matempid" + number;
        await axios.get(this.baseURL + '/sensorsdata/rooms')
            .then(function (responce) {
                for (let d of responce.data) {
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
                    td.setAttribute("class", "mactext")
                    td.setAttribute("id", macid)
                    td.innerHTML = d.macAddress

                    trow = thead.appendChild(document.createElement("tr"))
                    trow.appendChild(document.createElement("td")).innerHTML = "ind eller udenfor"
                    td = trow.appendChild(document.createElement("td"))
                    let select = td.appendChild(document.createElement("select"))
                    select.setAttribute("id", iuid)
                    if (d.inDoor === true) {
                        let option = select.appendChild(document.createElement("option"))
                        option.setAttribute("value", "true")
                        option.innerText = "Ja";
                        option = select.appendChild(document.createElement("option"))
                        option.setAttribute("value", "false")
                        option.innerText = "Nej";
                    }
                    else {
                        let option = select.appendChild(document.createElement("option"))
                        option.setAttribute("value", "false")
                        option.innerText = "Nej";
                        option = select.appendChild(document.createElement("option"))
                        option.setAttribute("value", "true")
                        option.innerText = "Ja";
                    }

                    let tbuddy = table.appendChild(document.createElement("tbody"))
                    trow = tbuddy.appendChild(document.createElement("tr"))
                    trow.appendChild(document.createElement("td")).innerHTML = "Optimal Temperatur"
                    td = trow.appendChild(document.createElement("td"))
                    input = td.appendChild(document.createElement("input"))
                    input.setAttribute("class", "input")
                    input.setAttribute("type", "number")
                    input.setAttribute("id", otempid)
                    input.setAttribute("placeholder", d.optimalTemperature);

                    trow = tbuddy.appendChild(document.createElement("tr"))
                    trow.appendChild(document.createElement("td")).innerHTML = "Minimum Temperatur"
                    td = trow.appendChild(document.createElement("td"))
                    input = td.appendChild(document.createElement("input"))
                    input.setAttribute("class", "input")
                    input.setAttribute("type", "number")
                    input.setAttribute("id", mitempid)
                    input.setAttribute("placeholder", d.minTemperature);

                    trow = tbuddy.appendChild(document.createElement("tr"))
                    trow.appendChild(document.createElement("td")).innerHTML = "Maksimum Temperatur"
                    td = trow.appendChild(document.createElement("td"))
                    input = td.appendChild(document.createElement("input"))
                    input.setAttribute("class", "input")
                    input.setAttribute("type", "number")
                    input.setAttribute("id", matempid)
                    input.setAttribute("placeholder", d.maxTemperature);

                    let savebutton = newdiv.appendChild(document.createElement("button"))
                    savebutton.setAttribute("class", "savebutton")
                    savebutton.innerHTML = "Gem"

                    let delbutton = newdiv.appendChild(document.createElement("button"))
                    delbutton.setAttribute("class", "deletebutton")
                    delbutton.innerHTML = "Slet"

                    number++
                    roomid = "roomid" + number;
                    otempid = "otempid" + number;
                    iuid = "iuid" + number;
                    mitempid = "mitempid" + number;
                    matempid = "matempid" + number;
                    macid = "macid" + number;
                }

                let button = tempdiv.appendChild(document.createElement("a"))
                button.setAttribute("id", "newroom")
                button.setAttribute("href", "create.html")
                button.setAttribute("style", "text-decoration:none")
                button.innerText = "Opret nyt rum"
            });
        this.roomarray = temparray;
        console.log(this.roomarray)
    }
}