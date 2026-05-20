namespace Parcours {
    type RadioAction = (userId: number, message: string) => void;
    type MicroNetAction = (userId: number, sender: string, message: string) => void;
    let userList: string[] = []
    let userIdList: number[] = []
    let userStateList: number[] = []
    let stateRadioActionList: { [state: number]: RadioAction } = {}


    //% block="envoyer le message $receivedString au parcours"
    export function onReceiveString(receivedString: string) {
        serial.writeLine("onReceiveString("+receivedString+")")
        if(multiGroup.groupOf(receivedString) == multiGroup.noGroup()){
            receiveNoGroupMessage(multiGroup.messagePart(receivedString))
        }else{
            receiveMessage(multiGroup.messagePart(receivedString))
        }
    }

    //% block= "nom du joueur %id"
    export function getUserName(id:number){
        return userList[id]
    }
    //% block="Le nom du parcours est %name"
    export function setName(name: string) {
        microNet.setName((name + "....").substr(0, 4));
     }

    //% block="nom du parcours"
    export function getName(): string {
        return microNet.getName();
    }

    /**
     * Définit l'action à exécuter à la réception d'un message radio pour une étape précise
     * @param userId le numéro de l'utilisateur
     * @param action le code à exécuter
     */
    //% block="RadioAction à l'étape $state"
    //% handlerStatement=1
    //% draggableParameters="reporter"
    export function setRadioAction(state: number, action: (id: number, message: string) => void) {
        stateRadioActionList[state] = action
        //console.log(action)
    }

    function receiveNoGroupMessage(message: string) {
        // id de l'émetteur
        let serialid = radio.receivedPacket(RadioPacketProperty.SerialNumber)
        // numéro d'utilisateur
        let userId = userIdList.indexOf(serialid)
        

        // inscription de la carte
        if (userId < 0) {
            userIdList.push(serialid)
            userList.push(microNet.getnoBody())
            userStateList.push(0)
            userId = userIdList.indexOf(serialid)
        }
//        serial.writeLine(microNet.recipientPart(message) +" === "+getName()+" && "+microNet.bodyPart(message)+" === INS")
        // inscription du participant
        if (microNet.recipientPart(message) === getName() && microNet.bodyPart(message) === "INS") {
            if (inscription(microNet.senderPart(message), userId)) {
                userStateList[userId] = 0
                send(multiGroup.noGroup(), userId, "GRP", userId.toString())
            }
        }
    }

    export function receiveMessage(message: string) {
        // id de l'émetteur
        let serialid = radio.receivedPacket(RadioPacketProperty.SerialNumber)
        // numéro d'utilisateur
        let userId = userIdList.indexOf(serialid)
        if (userId >= 0) {
            let state = userStateList[userId]
            if (stateRadioActionList[state]) {
                stateRadioActionList[state](userId, message)
            }
            send(userId, userId, "NIV", userStateList[userId].toString())
        }

    }

    function send(group: number, userid: number, instruction: string, data: string) {
        pause(400)
        let message = multiGroup.buildMessage(group, microNet.buildMessage(instruction + data, userList[userid]))
        serial.writeLine("send("+message+")")
        radio.sendString(message)
    }

    
    export function inscription(nom: string, id: number): boolean {
        let valid = nom.length === 4 && nom != microNet.getnoBody();
        for (let index = 0; valid && index < 4; index++) {
            if (nom.charCodeAt(index) >= 128) {
                valid = false;
            }
        }
        let pos = userList.indexOf(nom)

        if (valid) {
            userList[id] = nom;
        }
        //serial.writeLine("inscription("+nom+", "+id +"):"+valid)
        return valid
    }

    //% block="étape suivante pour $userId est $state"
    export function nextState(userId: number, state: number) {
        userStateList[userId] = state
        let dest = userList[userId]
        if (dest != microNet.getnoBody()) {
            send(userId, userId, "WIN", userStateList[userId].toString())
        }
    }

    //% block="si $test étape $posOk sinon étape $posKo"
    export function transition(test: boolean, posOk: number, posKo: number): number {
        return test ? posOk : posKo
    }

    //% block="affiche les joueurs en console"
    export function printUser() {
        let len = userIdList.length;
        serial.writeLine(`--- ${len} inscription${len > 1 ? "s" : ""} au parcours "${getName()}": ${control.deviceSerialNumber()} ---`);
        basic.pause(200);

        for (let i = 0; i < len; i++) {
            serial.writeLine("participant " + i + " : " + userList[i] + " | Etat: " + userStateList[i]);
            basic.pause(20); // Pause généreuse pour le debug
        }
        serial.writeLine("--- FIN ---");
    }
}