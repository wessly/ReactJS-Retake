const express = require("express");
const request = require("request");
const moment = require("moment-timezone");
const admin = require("firebase-admin");

admin.initializeApp({
    apiKey: "AIzaSyDy7ew-255sgVv7UvsQbL_hw3OYhTKkhNo",
    authDomain: "kletka-e1873.firebaseapp.com",
    databaseURL: "https://kletka-e1873.firebaseio.com",
    projectId: "kletka-e1873",
    storageBucket: "kletka-e1873.appspot.com",
    messagingSenderId: "403428516152"
});

moment.locale('bg');

const listAdmins = ['Ack4GDLzKNWbSzOQ9Jbg9tcOnJz1'];

const Event = require("../models/event");
const Player = require("../models/player");

var router = express.Router();

router.get("/", function (req, res, next) {

    let todayDate = moment().tz("Europe/Sofia").format('YYYY-MM-DD');
    let todayTime = moment().tz("Europe/Sofia").format('HH:mm');

    let upcomingEvents = [];

    Event.find({date: todayDate})
        .sort({
            title: 1
        })
        .populate("players")
        .then(events => {
            for (let event of events) {
                if (moment(todayTime, 'HH:mm').isBefore(moment(event.time, 'HH:mm'))) {
                    upcomingEvents.push(event);
                }
            }
            res.json(upcomingEvents);
        });
});

router.get("/event/:id", function (req, res, next) {
    let event_id = req.params.id;

    Event.findOne({
        _id: event_id
    })
        .populate("players")
        .then(event => {
            res.json(event);
        });
});

router.get("/schedule", function (req, res, next) {

    let eventsArr = [];

    Event.find()
        .then(events => {
            events.forEach(function (event) {
                let dateString = new Date(event.date);
                let timeString = event.time.split(":");

                dateString.setHours(timeString[0]);
                dateString.setMinutes(timeString[1]);

                eventsArr.push({
                    eventid: event._id,
                    title: event.location,
                    allDay: false,
                    start: dateString,
                    end: dateString
                });
            });
        })
        .then(() => {
            res.send(eventsArr);
        });
});

router.get("/manage", function (req, res, next) {

    let token = req.headers['firebasetoken'];
    let user = req.headers['userid'];

    admin.auth().verifyIdToken(token)
        .then(function (decodedToken) {

            Event.find({
                author_fb_id: user
            })
                .sort({
                    title: 1
                })
                .populate("players")
                .then(events => {
                    res.json(events);
                });
        }).catch(function (error) {
        console.log("Token error: " + error);
    });
});

router.get("/event/:id/player/:player_email", function (req, res, next) {

    let token = req.headers['firebasetoken'];

    admin.auth().verifyIdToken(token)
        .then(function (decodedToken) {

            let event_id = req.params.id;
            let player_email = req.params.player_email;
            let found = 0;

            Event.findOne({
                _id: event_id
            })
                .populate("players")
                .then(event => {

                    for (let player of event.players) {
                        if (player.email === player_email) {
                            found = 1;
                        }
                    }
                })
                .then(() => {

                    if (found > 0) {
                        res.send(true);
                    }

                    res.send(false);
                })
                .catch(error => {
                    console.log(error);
                });
        }).catch(function (error) {
        console.log("Token error: " + error);
    });
});

router.post("/create", function (req, res, next) {

    let token = req.headers['firebasetoken'];

    admin.auth().verifyIdToken(token)
        .then(function (decodedToken) {

            let event_town = req.body.town;
            let event_location = req.body.location;
            let event_date = req.body.date;
            let event_time = req.body.time;
            let event_format = req.body.format;
            let event_author = req.body.author;
            let event_author_fb_id = req.body.author_fb_id;
            let event_author_fb_name = req.body.author_fb_name;
            let event_created_at = moment()
                .tz("Europe/Sofia")
                .format("LTS ll");

            const townNames = {
                "Blagoevgrad": "Благоевград",
                "Burgas": "Бургас",
                "Varna": "Варна",
                "Veliko Turnovo": "Велико Търново",
                "Vidin": "Видин",
                "Vratsa": "Враца",
                "Gabrovo": "Габрово",
                "Dobrich": "Добрич",
                "Kardzhali": "Кърджали",
                "Kyustendil": "Кюстендил",
                "Lovech": "Ловеч",
                "Montana": "Монтана",
                "Pazardzhik": "Пазарджик",
                "Pernik": "Перник",
                "Pleven": "Плевен",
                "Plovdiv": "Пловдив",
                "Razgrad": "Разград",
                "Ruse": "Русе",
                "Silistra": "Силистра",
                "Sliven": "Сливен",
                "Smolyan": "Смолян",
                "Sofiya": "София",
                "Stara Zagora": "Стара Загора",
                "Turgovishte": "Търговище",
                "Khaskovo": "Хасково",
                "Shumen": "Шумен",
                "Yambol": "Ямбол"
            }

            let eventObj = {};

            if (townNames.hasOwnProperty(event_town)) {
                eventObj = {
                    town: townNames[event_town],
                    location: event_location.replace(/[^а-яА-Яa-zA-Z0-9\s\-\#]+/g, " "),
                    date: event_date.replace(/[^0-9\-]+/g, " "),
                    time: event_time.replace(/[^0-9\:]+/g, " "),
                    format: event_format,
                    author: event_author,
                    author_fb_id: event_author_fb_id,
                    author_fb_name: event_author_fb_name,
                    created_at: event_created_at
                };
            } else {
                eventObj = {
                    town: event_town.replace(/[^а-яА-Яa-zA-Z\s\-]+/g, " "),
                    location: event_location.replace(/[^а-яА-Яa-zA-Z0-9\s\-\#]+/g, " "),
                    date: event_date.replace(/[^0-9\-]+/g, " "),
                    time: event_time.replace(/[^0-9\:]+/g, " "),
                    format: event_format,
                    author: event_author,
                    author_fb_id: event_author_fb_id,
                    author_fb_name: event_author_fb_name,
                    created_at: event_created_at
                };
            }

            let author_email_filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,10})+$/;

            if (event_town.length > 4 &&
                event_town.length < 100 &&
                event_location.length > 4 &&
                event_location.length < 100 &&
                event_date.length === 10 &&
                event_time.length === 5 &&
                event_format.length === 3 &&
                event_format === "5v5" || event_format === "6v6" &&
                event_author.length > 5 &&
                event_author.length < 100 &&
                event_author_fb_id.length > 5 &&
                event_author_fb_name !== "" &&
                author_email_filter.test(event_author)) {

                Event.create(eventObj, function (errorEvent, dataEvent) {
                    if (errorEvent) {
                        console.log(errorEvent);
                    }

                    let location_key;

                    if (townNames.hasOwnProperty(event_town)) {

                        request('http://dataservice.accuweather.com/locations/v1/search?q=' + event_town + '&apikey=wbsTiArNq1BrILoRIvmrGhA1lcmjhdRj', {json: true}, (err, res, body) => {
                            if (err) {
                                console.log(err);
                            }

                            location_key = body[0].Key;

                            request('http://dataservice.accuweather.com/forecasts/v1/daily/1day/' + location_key + '?language=bg&metric=true&apikey=wbsTiArNq1BrILoRIvmrGhA1lcmjhdRj', {json: true}, (errLocation, resLocation, location) => {
                                if (errLocation) {
                                    console.log(errLocation);
                                }

                                Event.findOne({
                                    _id: dataEvent._id
                                }).then(
                                    thisEvent => {
                                        thisEvent.weather = location.DailyForecasts[0].Temperature.Minimum.Value + "° - " + location.DailyForecasts[0].Temperature.Maximum.Value + "°";
                                        thisEvent.save();
                                    }
                                );
                            });
                        });
                    }

                    if (event_format === "5v5") {

                        for (let i = 1; i <= 10; i++) {
                            Player.create({
                                name: 'Empty',
                                email: 'Empty',
                                slot: i
                            }, function (errorPlayer, dataPlayer) {
                                if (errorPlayer) {
                                    console.log(errorPlayer);
                                }

                                Event.findOne({
                                    _id: dataEvent._id
                                }).then(
                                    thisEvent => {
                                        thisEvent.players.push(dataPlayer._id);
                                        thisEvent.save();
                                    }
                                );
                            })
                        }

                    } else if (event_format === "6v6") {

                        for (let i = 1; i <= 12; i++) {
                            Player.create({
                                name: 'Empty',
                                email: 'Empty',
                                slot: i
                            }, function (errorPlayer, dataPlayer) {
                                if (errorPlayer) {
                                    console.log(errorPlayer);
                                }

                                Event.findOne({
                                    _id: dataEvent._id
                                }).then(
                                    thisEvent => {
                                        thisEvent.players.push(dataPlayer._id);
                                        thisEvent.save();
                                    }
                                );
                            })
                        }

                    }

                    res.json(dataEvent);
                });

            }
        }).catch(function (error) {
        console.log("Token error: " + error);
    });
});

router.put("/event/:id", function (req, res, next) {

    let token = req.headers['firebasetoken'];
    let user = req.headers['userid'];

    admin.auth().verifyIdToken(token)
        .then(function (decodedToken) {

            let event_id = req.params.id;

            let event_location = req.body.location
            let event_date = req.body.date
            let event_time = req.body.time

            let eventObj = {
                location: event_location.replace(/[^а-яА-Яa-zA-Z0-9\s\-\#]+/g, " "),
                date: event_date.replace(/[^0-9\-]+/g, " "),
                time: event_time.replace(/[^0-9\:]+/g, " ")
            };

            if (event_location.length > 4 &&
                event_location.length < 100 &&
                event_date.length === 10 &&
                event_time.length === 5) {

                Event.findOne({
                    _id: event_id,
                    author_fb_id: user
                })
                    .populate("players")
                    .then(preUpdateEvent => {

                        Event.update({
                                _id: preUpdateEvent._id
                            },
                            eventObj, {
                                upsert: true,
                                setDefaultsOnInsert: true
                            },

                            function (errorUpdate, updatedEvent) {
                                if (errorUpdate) {
                                    console.log(errorUpdate);
                                }

                                res.json({
                                    status: 200
                                });
                            }
                        );
                    });
            }
        }).catch(function (error) {
        console.log("Token error: " + error);
    });
});

router.put("/event/join/:id", function (req, res, next) {

    let token = req.headers['firebasetoken'];

    admin.auth().verifyIdToken(token)
        .then(function (decodedToken) {

            let player_id = req.params.id;
            let playerObj = {
                name: req.body.user.displayName,
                email: req.body.user.email,
                slot: req.body.slot
            }

            Player.findOne({
                _id: player_id
            })
                .then(preUpdatePlayer => {

                    Player.update({
                            _id: preUpdatePlayer._id
                        },
                        playerObj, {
                            upsert: true,
                            setDefaultsOnInsert: true
                        },

                        function (errorUpdate, updatedPlayer) {
                            if (errorUpdate) {
                                console.log(errorUpdate);
                            }

                            res.json({
                                status: 200
                            });
                        }
                    );
                });
        }).catch(function (error) {
        console.log("Token error: " + error);
    });
});

router.delete("/event/:id", function (req, res, next) {

    let token = req.headers['firebasetoken'];

    admin.auth().verifyIdToken(token)
        .then(function (decodedToken) {

            Event.findOne({
                _id: req.params.id
            })
                .populate("players")
                .then(event => {

                    for (let player of event.players) {
                        Player.remove({
                            _id: player._id
                        }).then(() => {
                        });
                    }

                    Event.remove({
                        _id: req.params.id
                    })
                        .then(() => {
                            res.json({
                                status: 200
                            });
                        })
                        .catch(errDeleteEvent => {
                            res.json({
                                status: 204
                            });
                        });
                })
                .catch(errFindEvent => {
                    res.json({
                        status: 204
                    });
                });
        }).catch(function (error) {
        console.log("Token error: " + error);
    });
});

router.put("/player/:id", function (req, res, next) {

    let token = req.headers['firebasetoken'];

    admin.auth().verifyIdToken(token)
        .then(function (decodedToken) {

            let player_id = req.params.id;

            let player_name = req.body.name
            let player_locked = req.body.locked

            let playerObj = {
                name: player_name,
                email: "Empty",
                locked: player_locked
            };

            Player.findOne({
                _id: player_id
            })
                .then(preUpdatePlayer => {

                    Player.update({
                            _id: preUpdatePlayer._id
                        },
                        playerObj, {
                            upsert: true,
                            setDefaultsOnInsert: true
                        },

                        function (errorUpdate, updatedPlayer) {
                            if (errorUpdate) {
                                console.log(errorUpdate);
                            }

                            res.json({
                                status: 200
                            });
                        }
                    );
                });
        }).catch(function (error) {
        console.log("Token error: " + error);
    });
});

router.put("/player/gk/:id", function (req, res, next) {

    let token = req.headers['firebasetoken'];

    admin.auth().verifyIdToken(token)
        .then(function (decodedToken) {

            let player_id = req.params.id;
            let playerObj = {}

            Player.findOne({
                _id: player_id
            })
                .then(preUpdatePlayer => {

                    if (preUpdatePlayer.isGk === false) {
                        playerObj = {
                            isGk: true
                        };
                    } else {
                        playerObj = {
                            isGk: false
                        };
                    }

                    Player.update({
                            _id: preUpdatePlayer._id
                        },
                        playerObj, {
                            upsert: true,
                            setDefaultsOnInsert: true
                        },

                        function (errorUpdate, updatedPlayer) {
                            if (errorUpdate) {
                                console.log(errorUpdate);
                            }

                            res.json({
                                status: 200
                            });
                        }
                    );
                });
        }).catch(function (error) {
        console.log("Token error: " + error);
    });
});

router.get("/username/:email", function (req, res, next) {

    let token = req.headers['firebasetoken'];

    admin.auth().verifyIdToken(token)
        .then(function (decodedToken) {

            let username_email = req.params.email;
            let username_email_filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,10})+$/;

            if (username_email_filter.test(username_email)) {

                var username_events_created = [];
                var fav_players = [];

                Event.find({
                    author: username_email
                })
                    .then(events => {
                        username_events_created = events.length;

                        Event.find()
                            .populate("players")
                            .then(events => {
                                for (let event of events) {
                                    for (let player of event.players) {
                                        if (player.email === username_email) {
                                            for (let player of event.players) {
                                                if (player.email !== username_email && player.name !== "Empty") {

                                                    var searchForPlayerName = fav_players.some(function (el) {
                                                        return el.name === player.name;
                                                    });

                                                    if (!searchForPlayerName) {
                                                        fav_players.push({
                                                            name: player.name,
                                                            played: 1
                                                        })
                                                    } else {
                                                        let objIndex = fav_players.findIndex((obj => obj.name === player.name));
                                                        fav_players[objIndex].played = fav_players[objIndex].played + 1;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                                fav_players.sort(function (a, b) {
                                    return a.name.localeCompare(b.name)
                                })

                                let favouritePlayer;
                                let favouritePlayerGames = 0;

                                for (let i = 0; i < fav_players.length; i++) {
                                    if (fav_players[i].played > favouritePlayerGames) {
                                        favouritePlayerGames = fav_players[i].played;
                                        favouritePlayer = fav_players[i].name
                                    }
                                }

                                res.json({
                                    events_created: username_events_created,
                                    favourite_player: {
                                        name: favouritePlayer,
                                        games: favouritePlayerGames
                                    }
                                })
                            });
                    });
            }
        }).catch(function (error) {
        console.log("Token error: " + error);
    });
});

router.put("/invite/event/:event", function (req, res, next) {

    let token = req.headers['firebasetoken'];
    let user = req.headers['userid'];

    admin.auth().verifyIdToken(token)
        .then(function (decodedToken) {

            let event_id = req.params.event;

            Event.findOne({
                _id: event_id,
                author_fb_id: user
            })
                .then(event => {

                    if (event.inviting === false) {

                        Event.update({
                                _id: event_id
                            }, {
                                inviting: true
                            }, {
                                upsert: true,
                                setDefaultsOnInsert: true
                            },

                            function (errorUpdate, updatedEvent) {
                                if (errorUpdate) {
                                    console.log(errorUpdate);
                                }

                                res.json({
                                    status: 200
                                });
                            }
                        );

                        // TODO: real action to search players
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }).catch(function (error) {
        console.log("Token error: " + error);
    });
});

router.get("/panel/allEvents", function (req, res, next) {
	
	let token = req.headers['firebasetoken'];
    let user = req.headers['userid'];

    admin.auth().verifyIdToken(token)
        .then(function (decodedToken) {
			
			let isAdmin = false;
			
			for (let adminName of listAdmins) {
				if (user === adminName) {
					isAdmin = true;
				}
			}
			
			if (isAdmin) {
				
				Event.find()
                .sort({
                    title: 1
                })
                .then(events => {
                    res.json(events);
                });
				
			} else {
				res.json('null');
			}
				
		}).catch(function (error) {
			console.log("Token error: " + error);
		});
});

router.delete("/panel/event/:id", function (req, res, next) {

    let token = req.headers['firebasetoken'];
	let user = req.headers['userid'];

    admin.auth().verifyIdToken(token)
        .then(function (decodedToken) {
			
			let isAdmin = false;
			
			for (let adminName of listAdmins) {
				if (user === adminName) {
					isAdmin = true;
				}
			}
			
			if (isAdmin) {
				
				Event.findOne({
					_id: req.params.id
				})
                .populate("players")
                .then(event => {

                    for (let player of event.players) {
                        Player.remove({
                            _id: player._id
                        }).then(() => {
                        });
                    }

                    Event.remove({
                        _id: req.params.id
                    })
                        .then(() => {
                            res.json({
                                status: 200
                            });
                        })
                        .catch(errDeleteEvent => {
                            res.json({
                                status: 204
                            });
                        });
                })
                .catch(errFindEvent => {
                    res.json({
                        status: 204
                    });
                });
				
			} else {
				res.json('null');
			}
				
        }).catch(function (error) {
        console.log("Token error: " + error);
    });
});

module.exports = router;
