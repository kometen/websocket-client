// http://www.tutorialspoint.com/html5/html5_websocket.htm

var ws = "";

// When coming matches are added to the database after the server has started
// AND available matches have been started league and season is stored as a
// global wariable when fetching those newly added.
window.league = "";
window.season = "";

// Add eventlistener when the page loads.
document.addEventListener("DOMContentLoaded", function () {
    if (window.WebSocket) {
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
                var div = document.getElementById("view1");
                div.innerHTML = "<table id='standings' class='t_standing center'><tr><th class='right_align'>#</th><th>Team</th><th class='right_align'>M</th><th class='right_align'>W</th><th class='right_align'>D</th><th class='right_align'>L</th><th class='right_align'>Goal</th><th class='right_align'>P</th></tr></table>";
                var table = document.getElementById("standings");
                receivedMsg.teams.sort(function (a, b) {
                    return b.points - a.points;
                });

                if (Array.isArray(receivedMsg.teams)) {
                    receivedMsg.teams.forEach(function (element, index, array) {
                        window.league = element.league;
                        window.season = element.season;

                        var row = table.insertRow(-1); // Last row.
                        var cell_standing = row.insertCell(0);
                        var cell_team = row.insertCell(1);
                        var cell_matches = row.insertCell(2);
                        var cell_won = row.insertCell(3);
                        var cell_draw = row.insertCell(4);
                        var cell_lost = row.insertCell(5);
                        var cell_goals = row.insertCell(6);
                        var cell_points = row.insertCell(7);

                        row.className = "shift_color";

                        cell_standing.className = "right_align";
                        cell_standing.innerHTML = index + 1;
                        cell_team.innerHTML = element.team;
                        cell_points.className = "right_align";
                        cell_points.innerHTML = element.points;
                        cell_matches.innerHTML = element.won + element.draw + element.lost;
                        cell_matches.className = "right_align";
                        cell_won.innerHTML = element.won;
                        cell_won.className = "right_align";
                        cell_draw.innerHTML = element.draw;
                        cell_draw.className = "right_align";
                        cell_lost.innerHTML = element.lost;
                        cell_lost.className = "right_align";
                        cell_goals.innerHTML = element.goals_for.toString() + "-" + element.goals_against.toString();
                        cell_goals.className = "right_align";
                    });
                }

            }

            if (receivedMsg.type == "matches") {
                var div = document.getElementById("avtiveMatches");

                if (Array.isArray(receivedMsg.teams)) {
                    div.innerHTML = "<table id='matches'></table>";
                    var table = document.getElementById("matches");

                    receivedMsg.teams.forEach(function (element, index, array) {

                        var row_1 = table.insertRow(-1);

                        var cell_date = row_1.insertCell(0);
                        var cell_score = row_1.insertCell(1);
                        var cell_add_goal = row_1.insertCell(2);
                        var cell_end_game_button = row_1.insertCell(3);
                        cell_date.innerHTML = moment(element.match_start_at).format("DD.M.YY HH:mm");
                        cell_score.innerHTML = "<b>Score</b>";
                        cell_add_goal.innerHTML = "<b><div class='right_pad'>Goal</div></b>";
                        cell_end_game_button.innerHTML = "<button class='btn'>End match</button>";
                        cell_end_game_button.id = "end_match_button_" + element.id;

                        var row_2 = table.insertRow(-1);

                        var cell_hometeam = row_2.insertCell(0);
                        var cell_hometeam_goal = row_2.insertCell(1);
                        var cell_hometeam_addbutton = row_2.insertCell(2);
                        cell_hometeam.innerHTML = element.hometeam;
                        cell_hometeam_goal.innerHTML = element.hometeam_score;
                        cell_hometeam_goal.className = "right_align";
                        cell_hometeam_addbutton.innerHTML = "+";
                        cell_hometeam_addbutton.id = "add_goal_hometeam_" + element.id;
                        cell_hometeam_addbutton.className = "center_align plusbtn";

                        var row_3 = table.insertRow(-1);

                        var cell_awayteam = row_3.insertCell(0);
                        var cell_awayteam_goal = row_3.insertCell(1);
                        var cell_awayteam_addbutton = row_3.insertCell(2);
                        cell_awayteam.innerHTML = element.awayteam;
                        cell_awayteam_goal.innerHTML = element.awayteam_score;
                        cell_awayteam_goal.className = "right_align";
                        cell_awayteam_addbutton.innerHTML = "+";
                        cell_awayteam_addbutton.id = "add_goal_awayteam_" + element.id;
                        cell_awayteam_addbutton.className = "center_align plusbtn";

                        // Add eventlistener() to add goals to a team.
                        document.getElementById("add_goal_hometeam_" + element.id).addEventListener("click", function () {
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
                        document.getElementById("add_goal_awayteam_" + element.id).addEventListener("click", function () {
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

                        // Add eventlistener() to to end the match.
                        document.getElementById("end_match_button_" + element.id).addEventListener("click", function () {
                            var d = new Date();
                            var msg = {
                                "type": "end_match",
                                "id": element.id,
                                "league": element.league,
                                "season": element.season,
                                "hometeam": element.hometeam,
                                "awayteam": element.awayteam,
                                "ended_at": d
                            }
                            msg = JSON.stringify(msg);
                            ws.send(msg);
                        });
                    });
                } else {
                    div.innerHTML = "No active matches at the moment."
                }
            }

            if (receivedMsg.type == "finished_matches") {
                var div = document.getElementById("finished_matches");

                if (Array.isArray(receivedMsg.teams)) {
                    div.innerHTML = "<hr>Recent matches<p><table id='finishedMatches' class='t_standing center'></table>";
                    var table = document.getElementById("finishedMatches");

                    receivedMsg.teams.forEach(function (element, index, array) {
                        var row_1 = table.insertRow(-1);
                        var cell_hometeam = row_1.insertCell(0);
                        var cell_awayteam = row_1.insertCell(1);
                        var cell_result = row_1.insertCell(2);

                        row_1.className = "shift_odd_color";

                        cell_hometeam.innerHTML = element.hometeam;
                        cell_awayteam.innerHTML = element.awayteam;
                        cell_result.innerHTML = element.hometeam_score.toString() + "-" + element.awayteam_score.toString();
                    });
                }
            }

            if (receivedMsg.type == "coming_matches") {
                var div = document.getElementById("view3");

                // If it's an array, ie. has data.
                if (Array.isArray(receivedMsg.teams)) {
                    div.innerHTML = "<table id='coming_matches' class='t_standing'></table>";
                    var table = document.getElementById("coming_matches");
                    receivedMsg.teams.forEach(function (element, index, array) {

                        var row_1 = table.insertRow(-1);
                        var cell_date = row_1.insertCell(0);
                        var cell_1 = row_1.insertCell(1);
                        var cell_2 = row_1.insertCell(2);

                        cell_date.innerHTML = moment(element.match_start_at).format("DD.M.YY HH:mm");
                        cell_1.innerHTML = "<b>Awayteam</b>";
                        cell_2.innerHTML = "<button class='btn'>Start</button>";
                        cell_2.id = "start_match_" + element.id;

                        var row_2 = table.insertRow(-1);
                        var cell_hometeam = row_2.insertCell(0);
                        var cell_awayteam = row_2.insertCell(1);
                        var cell_empty = row_2.insertCell(2);

                        row_1.className = "first_second_four";
                        row_2.className = "first_second_four";

                        cell_hometeam.innerHTML = element.hometeam;
                        cell_awayteam.innerHTML = element.awayteam;

                        // Add eventlistener() to start a match.
                        document.getElementById("start_match_" + element.id).addEventListener("click", function () {
                            var d = new Date();
                            var msg = {
                                "type": "start_match",
                                "id": element.id,
                                "league": element.league,
                                "season": element.season,
                                "hometeam": element.hometeam,
                                "awayteam": element.awayteam
                            }
                            msg = JSON.stringify(msg);
                            ws.send(msg);
                        });
                    });
                } else {
                    div.innerHTML = "<button class='btn' id='get_coming_matches'>Click</button> to fetch coming matches."
                    // Add eventlistener() to start a match.
                    document.getElementById("get_coming_matches").addEventListener("click", function () {
                        var d = new Date();
                        var msg = {
                            "type": "get_coming_matches",
                            "league": window.league,
                            "season": window.season,
                        }
                        msg = JSON.stringify(msg);
                        ws.send(msg);
                    });
                }
            }

            if (receivedMsg.type == "matches_without_startdate") {
                var div = document.getElementById("matchesWithoutDate");

                // If it's an array, ie. has data.
                if (Array.isArray(receivedMsg.teams)) {
                    div.innerHTML = "<table id='matches_without_startdate' class='t_standing'></table>";
                    var table = document.getElementById("matches_without_startdate");

                    receivedMsg.teams.forEach(function (element, index, array) {

                        var row_1 = table.insertRow(-1);
                        var cell_hometeam = row_1.insertCell(0);
                        var cell_date_field = row_1.insertCell(1);

                        var row_2 = table.insertRow(-1);
                        var cell_awayteam = row_2.insertCell(0);
                        var cell_set_date_button = row_2.insertCell(1);

                        row_1.className = "first_second_four";
                        row_2.className = "first_second_four";

                        cell_hometeam.innerHTML = element.hometeam;
                        cell_date_field.innerHTML = "<input type='text' size='15' id='datepicker_" + element.id + "'>";
                        cell_awayteam.innerHTML = element.awayteam;
                        cell_set_date_button.innerHTML = "<button class='btn'>Set match date</button>";
                        cell_set_date_button.id = "set_match_date_" + element.id;

                        // Add Pikaday datepicker to input type text.
                        var picker = new Pikaday({
                            field: document.getElementById("datepicker_" + element.id),
                            position: "bottom right",
                            reposition: false,
                            use24hour: true
                        });

                        // Add eventlistener() to start a match.
                        document.getElementById("set_match_date_" + element.id).addEventListener("click", function () {
                            var d = new Date();
                            var msg = {
                                "type": "set_match_date",
                                "id": element.id,
                                "league": element.league,
                                "season": element.season,
                                "hometeam": element.hometeam,
                                "awayteam": element.awayteam,
                                "match_start_at": document.getElementById("datepicker_" + element.id).value
                            }
                            msg = JSON.stringify(msg);
                            ws.send(msg);
                        });
                    });
                }
            }

            if (receivedMsg.type == "msg") {
                alert("Message received: " + receivedMsg.data);
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

function connect () {
    document.getElementById("connectButton").setAttribute("disabled", "disabled");
    document.getElementById("disconnectButton").removeAttribute("disabled");
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

function getMatchesWithoutDate() {
    var msg = {
        "type": "get_matches_without_startdate",
        "league": window.league,
        "season": window.season
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
