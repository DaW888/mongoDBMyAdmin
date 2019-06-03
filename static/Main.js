class Main {
    constructor () {
        this.start();
        this.data = [];
    }

    start() {
        const ip = prompt("Podaj IP servera bazy danych", "192.168.1.100");
        if(ip != ""){
            console.log(ip);
        }
    }


}