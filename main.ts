function etape0 (message: string, num: number) {
    if (message.substr(8) == "++") {
        Parcours.nextState(num, 1)
    }
}
input.onButtonPressed(Button.A, function () {
    radio.sendNumber(control.deviceSerialNumber())
})
radio.onReceivedString(function (receivedString) {
    Parcours.onReceiveString(receivedString)
})
input.onButtonPressed(Button.B, function () {
    Parcours.printUser()
})
radio.setTransmitSerialNumber(true)
radio.setGroup(1)
Parcours.setName("loup")
Parcours.setRadioAction(0, function (id, message) {
    etape0(message, id)
})
basic.forever(function () {
	
})
