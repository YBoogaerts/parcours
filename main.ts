input.onButtonPressed(Button.A, function () {
    radio.sendNumber(control.deviceSerialNumber())
})
radio.onReceivedString(function (receivedString) {
    Parcours.onReceiveString(receivedString)
})
radio.setTransmitSerialNumber(true)
radio.setGroup(1)
Parcours.setName("loup")
basic.forever(function () {
	
})
