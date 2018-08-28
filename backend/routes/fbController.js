var express = require('express');
var router = express.Router();
var request = require('request');
var moment = require("moment-timezone");

moment.locale('bg');

const Event = require("../models/event");
const Player = require("../models/player");

router.get('/webhook', function (req, res, next) {
    const hubChallenge = req.query['hub.challenge'];

    const hubMode = req.query['hub.mode'];
    const verifyTokenMatches = (req.query['hub.verify_token'] === 'blablabla');

    if (hubMode && verifyTokenMatches) {
        res.status(200).send(hubChallenge);
    } else {
        res.status(403).end();
    }
    // res.status(200).end();
});

router.post('/webhook', function (req, res, next) {

    var userRealFirstName;
    var userRealLastName;

    if (req.body.object === 'page') {
        req.body.entry.forEach((entry) => {
            entry.messaging.forEach((event) => {
                if (event.message && event.message.text) {

                    if (event.message.text === "igraq") {

                        request({
                            url: "https://graph.facebook.com/v2.6/" + event.sender.id + "?fields=first_name,last_name",
                            qs: {access_token: "EAAC3v3c7Kt0BABcJQ0myVdUWw34mduF67uJR6ajSrZCVtXvUxYUhrEh7yuy2sVw16DmDTf2Trb37p6lOs9TNRueb4W9BZA22cmLDZB0NVusx0iZCM5BcnTk7ujtNjgSuk8QA1re4W1Rd2cOjNy5CMbE7BZAnQ8ra5PcT91QCnJgZDZD"},
                            method: "GET"
                        }, function (error, response, body) {
                            if (error) {
                                console.log("Error getting profile: " + response.error);
                            }

                            let shits = body.split(",")
                            userRealFirstName = shits[0].split(":")[1];
                            userRealFirstName = userRealFirstName.substr(1, userRealFirstName.length - 1);
                            userRealFirstName = userRealFirstName.replace('"', "");

                            let convertToString = userRealFirstName.split("\\u");
                            let finalString;

                            for (let char of convertToString) {
                                if (char.length > 0) {
                                    finalString += String.fromCharCode("0x"+char);
                                }
                            }

                            finalString = finalString.replace("undefined", "");

                            let todayDate = moment().tz("Europe/Sofia").format('YYYY-MM-DD');
                            let todayTime = moment().tz("Europe/Sofia").format('HH:mm');

                            Event.find({
                                date: todayDate
                            }).sort({
                                time: 1
                            }).populate("players")
                                .then(events => {
                                    if (events.length > 0) {

                                        let index = 1;

                                        for (let kletka of events) {

                                            if (moment(todayTime, 'HH:mm').isBefore(moment(kletka.time, 'HH:mm'))) {
                                                sendMessage(event.sender.id, {text: "#" + index + " " + kletka.time + " ("+ kletka.author_fb_name +") -> " + kletka.location + " -> " + kletka.town});
                                                index++
                                            } else {
                                                sendMessage(event.sender.id, {text: "#" + index + " (ZAPOCHNALA) " + kletka.time + " ("+ kletka.author_fb_name +") -> " + kletka.location + " -> " + kletka.town});
                                                index++
                                            }
                                        }
                                    } else {
                                        sendMessage(event.sender.id, {text: finalString + ", nqma aktivni kletki dnes."});
                                    }
                                });

                        });

                    } else {
                        sendMessage(event.sender.id, {text: "nqma tekst tuk"});
                    }

                }
            });
        });
        res.status(200).end();
    }
});

async function sendMessage(recipientId, message) {
    await request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: {access_token: "EAAC3v3c7Kt0BABcJQ0myVdUWw34mduF67uJR6ajSrZCVtXvUxYUhrEh7yuy2sVw16DmDTf2Trb37p6lOs9TNRueb4W9BZA22cmLDZB0NVusx0iZCM5BcnTk7ujtNjgSuk8QA1re4W1Rd2cOjNy5CMbE7BZAnQ8ra5PcT91QCnJgZDZD"},
        method: "POST",
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function (error, response, body) {
        if (error) {
            console.log("Error sending message: " + response.error);
        }
    });
}

async function getProfile(recipientId) {
    await request({
        url: "https://graph.facebook.com/v2.6/" + recipientId + "?fields=first_name,last_name",
        qs: {access_token: "EAAC3v3c7Kt0BABcJQ0myVdUWw34mduF67uJR6ajSrZCVtXvUxYUhrEh7yuy2sVw16DmDTf2Trb37p6lOs9TNRueb4W9BZA22cmLDZB0NVusx0iZCM5BcnTk7ujtNjgSuk8QA1re4W1Rd2cOjNy5CMbE7BZAnQ8ra5PcT91QCnJgZDZD"},
        method: "GET"
    }, function (error, response, body) {
        if (error) {
            console.log("Error getting profile: " + response.error);
        }

        console.log(body);
    });
}

module.exports = router;
