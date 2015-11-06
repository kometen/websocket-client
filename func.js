// http://www.tutorialspoint.com/html5/html5_websocket.htm

var ws = "";

// Add eventlistener when the page loads.
document.addEventListener("DOMContentLoaded", function () {
    if (window.WebSocket) {
        // Disable message field.
        document.getElementById("messageField").setAttribute("disabled", "disabled");
        // Let us open a web socket.
        var hname = window.location.hostname;
        ws = new WebSocket("ws://" + hname + ":9002");
        ws.onopen = function () {
            var m = "la_liga";
            var msg = {
                "type": "request",
                "data": m
            }
            msg = JSON.stringify(msg);
            ws.send(msg);
        }
        ws.onmessage = function (e) {
            var receivedMsg = JSON.parse(e.data);

            if (receivedMsg.type == "table") {
                console.log(receivedMsg);
                console.log(receivedMsg.teams[0].points);
                var div = document.getElementById("leagues");
                div.innerHTML = "<ul>";
                receivedMsg.teams.sort(function (a, b) {
                    return b.points - a.points;
                });
                receivedMsg.teams.forEach(function (element, index, array) {
                    console.log("team: " + element.team + ", points: " + element.points);
                    div.innerHTML = div.innerHTML + "<li>Team: " + element.team + ", points: " + element.points + "</li>";
                });
                div.innerHTML = div.innerHTML + "</ul>";
            }

            if (receivedMsg.type == "msg") {
                alert("Message received: " + receivedMsg.data);
                console.log(receivedMsg.data);
                document.getElementById("leagues").innerHTML = "Data: " + receivedMsg.data + ", length: " + receivedMsg.cnt;
            }
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
});

// Add eventlistener to loginNameField field.
document.getElementById("loginNameField").addEventListener("keyup", function (e) {
    var l = document.getElementById("loginNameField").value;
    // Disable.
    if (l.length === 0) {
        document.getElementById("connectButton").setAttribute("disabled", "disabled");
    }
    // Enable
    if (l.length > 0) {
        document.getElementById("connectButton").removeAttribute("disabled");
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
        document.getElementById("messageButton").setAttribute("disabled", "disabled");
    }
    // Enable
    if (l.length > 0) {
        document.getElementById("messageButton").removeAttribute("disabled");
        var key = e.keyCode;
        if (key === 13) {
            sendMessage();
        }
    }
});

function connect () {
    document.getElementById("connectButton").setAttribute("disabled", "disabled");
    document.getElementById("disconnectButton").removeAttribute("disabled");
    document.getElementById("messageField").removeAttribute("disabled");
    var l = document.getElementById("loginNameField").value;
    var msg = {
        "type": "lgn",
        "data": l
    }
    msg = JSON.stringify(msg);
    ws.send(msg);
}

function disconnect () {
    if (window.WebSocket) {
        ws.close();
        document.getElementById("loginNameField").value = "";
        document.getElementById("loginNameField").disabled = false;
        document.getElementById("connectButton").removeAttribute("disabled");
        document.getElementById("disconnectButton").setAttribute("disabled", "disabled");
    } else {
        alert("Websocket unsupported");
    }
}

function sendMessage () {
    var m = document.getElementById("messageField").value;
    var msg = {
        "type": "update",
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
