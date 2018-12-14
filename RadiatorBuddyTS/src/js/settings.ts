import axios, {AxiosRequestConfig, AxiosPromise} from "axios";

export class Settings{
    password: string = "passwordtom";
    username: string = "usenametom";
    otemp: string;
    matemp: string;
    mitemp: string;
    otempinput: HTMLInputElement = <HTMLInputElement> document.getElementById("otemp");
    matempinput: HTMLInputElement = <HTMLInputElement> document.getElementById("maxtemp");
    mitempinput: HTMLInputElement = <HTMLInputElement> document.getElementById("mintemp");


    async getudata(){
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

        this.otemp = totemp
        this.matemp = tmatemp
        this.mitemp = tmitemp
        
        this.otempinput.setAttribute("placeholder", totemp)
        this.matempinput.setAttribute("placeholder", tmatemp)
        this.mitempinput.setAttribute("placeholder", tmitemp)
    }

    async setglobltemps(){
        let totemp: string;
        let tmatemp: string;
        let tmitemp: string;

        console.log(this.otempinput.value)
        if(this.otempinput.value !== ''){
            this.otemp = this.otempinput.value;
            console.log(this.otemp)
        }
        if(this.mitempinput.value !== ''){
            this.mitemp = this.mitempinput.value;
            console.log(this.mitemp)
        }
        if(this.matempinput.value !== ''){
            this.matemp = this.matempinput.value;
            console.log(this.matemp)
        }

        totemp = this.otemp
        tmatemp = this.matemp
        tmitemp = this.mitemp

        if(tmatemp < totemp){
            tmatemp = this.matempinput.placeholder
        }

        if(tmitemp > totemp){
            tmitemp = this.mitempinput.placeholder
        }

        if(totemp > tmatemp || totemp < tmitemp){
            totemp = this.otempinput.placeholder
        }

        if(confirm("Vil du overskrive alle rums temperature? \nOk = ja og Annuller = nej")){
            await axios.get('https://radiatorbuddy.azurewebsites.net/api/sensorsdata/rooms')
            .then(async function(responce){
                for(let i of responce.data){
                    await axios.put("https://radiatorbuddy.azurewebsites.net/api/sensorsdata/rooms", {
                        MacAddress: i.macAddress,
                        Location: i.location,
                        InDoor: i.inDoor,
                        OptimalTemperature: totemp,
                        MinTemperature: tmitemp,
                        MaxTemperature: tmatemp
                    })
                }
            })
        }

        await axios.put('https://radiatorbuddy.azurewebsites.net/api/rbuddyusers',{
            userName: "admin                         ",
            password: "admin                         ",
            globalOptimalTemperature: totemp,
            globalMinTemperature: tmitemp,
            globalMaxTemperature: tmatemp
        })
        .then(function(){
            window.location.reload();
        })
    }
}