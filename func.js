// http://www.tutorialspoint.com/html5/html5_websocket.htm

var ws = "";

// Add eventlistener to loginNameField field.
document.getElementById("loginNameField").addEventListener("keyup", function (e) {
    var l = document.getElementById("loginNameField").value;
    // Disable.
    if (l.length === 0) {
        document.getElementById("connectButton").classList.add("pure-button-disabled");
    }
    // Enable
    if (l.length > 0) {
        document.getElementById("connectButton").classList.remove("pure-button-disabled");
        var key = e.keyCode;
        if (key === 13) {
            document.getElementById("loginNameField").disabled = true;
            connect();
        }
    }
});

// Add eventlistener to message field.
document.getElementById("messageField").addEventListener("keyup", function (e) {
    var l = document.getElementById("messageField").value;
    // Disable.
    if (l.length === 0) {
        document.getElementById("messageButton").classList.add("pure-button-disabled");
    }
    // Enable
    if (l.length > 0) {
        document.getElementById("messageButton").classList.remove("pure-button-disabled");
        var key = e.keyCode;
        if (key === 13) {
            sendMessage();
        }
    }
});

function connect () {
    if (window.WebSocket) {
        // Let us open a web socket
        ws = new WebSocket("ws://localhost:9002");
        ws.onopen = function (e) {
            document.getElementById("connectButton").classList.add("pure-button-disabled");
            document.getElementById("disconnectButton").classList.remove("pure-button-disabled");
            var l = document.getElementById("loginNameField").value;
            var msg = {
                "type": "lgn",
                "data": l
            }
            msg = JSON.stringify(msg);
            ws.send(msg);
        }
        ws.onmessage = function (e) {
            var receivedMsg = e.data;
            alert("Message received: " + receivedMsg);
        }
        ws.onerror = function (e) {
            alert("Unable to connect");
        }
        ws.onclose = function (e) {
            // For safari
            if (e.code == 1006) {
                alert("Unable to connect");
            } else {
                alert("Connection closed");
            }
        }
    } else {
        alert("Websocket unsupported");
    }
}

function disconnect () {
    if (window.WebSocket) {
        ws.close();
        document.getElementById("loginNameField").value = "";
        document.getElementById("loginNameField").disabled = false;
        document.getElementById("connectButton").classList.remove("pure-button-disabled");
        document.getElementById("disconnectButton").classList.add("pure-button-disabled");
    } else {
        alert("Websocket unsupported");
    }
}

function sendMessage () {
    var m = document.getElementById("messageField").value;
    var msg = {
        "type": "msg",
        "data": m
    }
    msg = JSON.stringify(msg);
    ws.send(msg);
}

function testWebsocket () {
    if (window.WebSocket) {
        alert("Websocket supported");
    } else {
        alert("Websocket unsupported");
    }
}