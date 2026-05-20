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
basic.forever(function () {
	
})
