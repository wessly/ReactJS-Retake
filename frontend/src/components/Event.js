import React, { Component } from "react";
import moment from "moment-timezone";
import Disqus from 'disqus-react';
import { fetchOneEvent } from "./../api/request";

const todayDate = moment().tz("Europe/Sofia").format('YYYY-MM-DD');

export default class Event extends Component {
    constructor() {
        super()

        this.state = {
            town: "",
            location: "",
            date: "",
            time: "",
            format: "",
            author: "",
            author_fb_name: "",
            created_at: "",
            players: [],
            weather: ""
        }
    }

    componentWillMount() {
        fetchOneEvent(this.props.match.params.id)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    town: data.town,
                    location: data.location,
                    date: data.date,
                    time: data.time,
                    format: data.format,
                    author: data.author,
                    author_fb_name: data.author_fb_name,
                    created_at: data.created_at,
                    players: data.players.sort(function (a, b) {
                        return a.slot - b.slot;
                    }),
                    weather: data.weather
                });
            });
    }

    render() {
        const disqusShortname = 'kletki-win';
        const disqusConfig = {
            url: "https://kletki.win/" + this.props.location.pathname,
            identifier: this.props.match.params.id,
            title: this.state.date + " " + this.state.time + " - " + this.state.location,
        };
        return (
            <div className="ui segment">
                <center>
                    {moment(this.state.date, 'YYYY-MM-DD').isBefore(moment(todayDate, 'YYYY-MM-DD')) === true ?
                        <div class="ui three top attached steps">
                            <div class="disabled step">
                                <i class="map marker alternate icon"></i>
                                <div class="content">
                                    <div class="title">{this.state.town}</div>
                                    <div class="description">
                                        {this.state.location}
                                    </div>
                                </div>
                            </div>
                            <div class="disabled step">
                                <i class="clock icon"></i>
                                <div class="content">
                                    <div class="title">{this.state.time}</div>
                                    <div class="description">
                                        {this.state.date}
                                    </div>
                                </div>
                            </div>
                            <div class="disabled step">
                                <i class="sun icon"></i>
                                <div class="content">
                                    <div class="title">{this.state.weather? this.state.weather : "n/a"}</div>
                                    <div class="description">
                                        Приблизителна прогноза
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div class="ui three top attached steps">
                            <div class="active step">
                                <i class="map marker alternate icon"></i>
                                <div class="content">
                                    <div class="title">{this.state.town}</div>
                                    <div class="description">
                                        {this.state.location}
                                    </div>
                                </div>
                            </div>
                            <div class="active step">
                                <i class="clock icon"></i>
                                <div class="content">
                                    <div class="title">{this.state.time}</div>
                                    <div class="description">
                                        {this.state.date}
                                    </div>
                                </div>
                            </div>
                            <div class="active step">
                                <i class="sun icon"></i>
                                <div class="content">
                                    <div class="title">{this.state.weather? this.state.weather : "n/a"}</div>
                                    <div class="description">
                                        Приблизителна прогноза
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    <div className="ui attached segment">
                        <div class="fluid ui raised segment red" tabindex="0">домакини</div>
                        <div class="ui big horizontal list">
                            {this.state.players.filter(function (player) {
                                if (this.state.format === "5v5") {
                                    return player.slot <= 5;
                                }
                                return player.slot <= 6;
                            }, this).map((player, i) => {
                                return (
                                    <div
                                        key={i}
                                        className="item">
                                        {player.name !== "Empty" || player.locked !== false ?
                                            <img class="ui avatar image" src="/images/male.png" alt="male"/>
                                            :
                                            <img class="ui avatar image" src="/images/profile.png" alt="profile"/>
                                        }
                                        <div class="content">
                                            <div class="header">{player.name}</div>
                                            {player.isGk === true ? "вратар" : "полеви"}
                                        </div>
                                    </div>

                                )
                            })}
                        </div>
                    </div>
                    <div className="ui attached segment">
                        <div class="fluid ui raised segment blue" tabindex="0">гости</div>
                        <div class="ui big horizontal list">
                            {this.state.players.filter(function (player) {
                                if (this.state.format === "5v5") {
                                    return player.slot > 5;
                                }
                                return player.slot > 6;
                            }, this).map((player, i) => {
                                return (
                                    <div
                                        key={i}
                                        className="item">
                                        {player.name !== "Empty" || player.locked !== false ?
                                            <img class="ui avatar image" src="/images/male.png" alt="male"/>
                                            :
                                            <img class="ui avatar image" src="/images/profile.png" alt="profile"/>
                                        }
                                        <div class="content">
                                            <div class="header">{player.name}</div>
                                            {player.isGk === true ? "вратар" : "полеви"}
                                        </div>
                                    </div>

                                )
                            })}
                        </div>
                    </div>
                </center>
                <br />
                <br />
                <Disqus.CommentCount shortname={disqusShortname} config={disqusConfig}>
                </Disqus.CommentCount>
                <Disqus.DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
            </div>
        )
    }
}