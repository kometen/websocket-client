// http://www.tutorialspoint.com/html5/html5_websocket.htm

var ws = "";

// Add eventlistener when the page loads.
document.addEventListener("DOMContentLoaded", function () {
    if (window.WebSocket) {
        // Disable message field.
        document.getElementById("pointsField").setAttribute("disabled", "disabled");
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
                console.log("table: " + receivedMsg);
                var div = document.getElementById("view1");
                div.innerHTML = "<table id='standings'><tr><th class='right_align'>#</th><th>Team</th><th>Points</th></tr></table>";
                var table = document.getElementById("standings");
                receivedMsg.teams.sort(function (a, b) {
                    return b.points - a.points;
                });
                receivedMsg.teams.forEach(function (element, index, array) {
//                    console.log("team: " + element.team + ", points: " + element.points);
                    var row = table.insertRow(-1); // Last row.
                    var cell_standing = row.insertCell(0);
                    var cell_team = row.insertCell(1);
                    var cell_points = row.insertCell(2);
                    cell_standing.className = "right_align";
                    cell_standing.innerHTML = index + 1;
                    cell_team.innerHTML = element.team;
                    cell_points.className = "right_align";
                    cell_points.innerHTML = element.points;
                });
            }

            if (receivedMsg.type == "matches") {
                console.log("matches: " + receivedMsg);
                var div = document.getElementById("view2");
                div.innerHTML = "<table id='matches'></table>";
                var table = document.getElementById("matches");
                receivedMsg.teams.forEach(function (element, index, array) {

                    var row_1 = table.insertRow(-1);
                    var cell_date = row_1.insertCell(0);
                    var cell_score = row_1.insertCell(1);
                    var cell_add_goal = row_1.insertCell(2);
                    cell_date.innerHTML = moment(element.match_start_at).format("DD.M.YY HH:mm");
                    cell_score.innerHTML = "<b>Score</b>";
                    cell_add_goal.innerHTML = "<b>Goal</b>";

                    var row_2 = table.insertRow(-1);
                    var cell_hometeam = row_2.insertCell(0);
                    var cell_hometeam_goal = row_2.insertCell(1);
                    var cell_hometeam_addbutton = row_2.insertCell(2);
                    cell_hometeam.innerHTML = element.hometeam;
                    cell_hometeam_goal.innerHTML = element.hometeam_score;
                    cell_hometeam_goal.className = "right_align";
                    cell_hometeam_addbutton.innerHTML = "+";
                    cell_hometeam_addbutton.id = "hometeam_" + element.id;
                    cell_hometeam_addbutton.className = "center_align btn";

                    var row_3 = table.insertRow(-1);
                    var cell_awayteam = row_3.insertCell(0);
                    var cell_awayteam_goal = row_3.insertCell(1);
                    var cell_awayteam_addbutton = row_3.insertCell(2);
                    cell_awayteam.innerHTML = element.awayteam;
                    cell_awayteam_goal.innerHTML = element.awayteam_score;
                    cell_awayteam_goal.className = "right_align";
                    cell_awayteam_addbutton.innerHTML = "+";
                    cell_awayteam_addbutton.id = "awayteam_" + element.id;
                    cell_awayteam_addbutton.className = "center_align btn";

                    // Add eventlistener() to add goals to a team.
                    document.getElementById("hometeam_" + element.id).addEventListener("click", function () {
                        var d = new Date();
                        var msg = {
                            "type": "goal",
                            "id": element.id,
                            "league": element.league,
                            "season": element.season,
                            "scoringteam": "hometeam",
                            "scoringgoal": "homegoal",
                            "hometeam": element.hometeam,
                            "awayteam": element.awayteam,
                            "hometeam_score": element.hometeam_score,
                            "awayteam_score": element.awayteam_score,
                            "goal": 1,
                            "scored_at": d
                        }
                        msg = JSON.stringify(msg);
                        ws.send(msg);
                    });
                    document.getElementById("awayteam_" + element.id).addEventListener("click", function () {
                        var d = new Date();
                        var msg = {
                            "type": "goal",
                            "id": element.id,
                            "league": element.league,
                            "season": element.season,
                            "scoringteam": "awayteam",
                            "scoringgoal": "awaygoal",
                            "hometeam": element.hometeam,
                            "awayteam": element.awayteam,
                            "hometeam_score": element.hometeam_score,
                            "awayteam_score": element.awayteam_score,
                            "goal": 1,
                            "scored_at": d
                        }
                        msg = JSON.stringify(msg);
                        ws.send(msg);
                    });
                });
            }

            if (receivedMsg.type == "msg") {
                alert("Message received: " + receivedMsg.data);
                console.log(receivedMsg.data);
                document.getElementById("view1").innerHTML = "Data: " + receivedMsg.data + ", length: " + receivedMsg.cnt;
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
document.getElementById("pointsField").addEventListener("keyup", function (e) {
    var l = document.getElementById("pointsField").value;
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
    document.getElementById("pointsField").removeAttribute("disabled");
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
    var t = document.getElementById("teamField").value;
    var p = document.getElementById("pointsField").value;
    var msg = {
        "type": "update",
        "team": t,
        "points": p
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
