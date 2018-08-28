import React, { Component } from "react";
import { Link } from "react-router-dom";
import { fetchAllEvents, playerExist, joinEvent } from "./../api/request";

import sortBy from "sort-by";
import { Popup } from 'semantic-ui-react';

// TODO import InfiniteScroll from 'react-infinite-scroller';

export default class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allEvents: [],
      filterDate: "",
      filterTime: "",
      filterTown: ""
    };

    this.joinEvent = this.joinEvent.bind(this);
    this.handleFilterTime = this.handleFilterTime.bind(this);
    this.handleFilterTown = this.handleFilterTown.bind(this);
  }

  componentWillMount() {
    fetchAllEvents()
      .then(response => response.json())
      .then(data => {
        this.setState({
          allEvents: data.sort(sortBy('-date', 'time', 'location'))
        });
      });
  }

  componentWillUnmount() {
    this.setState({
      allEvents: []
    });
  }

  handleFilterTime() {
    this.setState({
      allEvents: this.state.allEvents.sort(sortBy('date', '-time', 'location'))
    });
  }

  handleFilterTown() {
    this.setState({
      allEvents: this.state.allEvents.sort(sortBy('date', 'time', '-location'))
    });
  }

  joinEvent(e) {

    if (this.props.user) {

      let question = window.confirm("Сигурен ли сте?");

      if (question === true) {

        let eventid = e.target.getAttribute("eventid")
        let playerid = e.target.getAttribute("playerid")
        let slotObj = e.target.getAttribute("slotid")
        let userObj = this.props.user

        playerExist(eventid, this.props.user.email, this.props.userToken)
        .then(response => response.json())
        .then(data => {
          if (data === false) {
            joinEvent(playerid, {user: userObj, slot: slotObj}, this.props.userToken).then(() => {
              fetchAllEvents()
              .then(response => response.json())
              .then(data => {
                this.setState({
                  allEvents: data.sort(sortBy('-date', 'time', 'location'))
                });
              });
            });
          } else {
            window.alert('Вече сте записан за тази клетка!')
          }
        });
      }
    } else {
      window.alert('Моля, влезте в системата!')
    }
  }

  render() {
    let createLink;
    if (this.props.user) {
      createLink = 
      <Link to="/create">
        <button className="ui right labeled icon button">
          <i className="right arrow icon"></i>
          Организирай
        </button>
      </Link>
    } else {
      createLink = ""
    }
    return (
      <div>
        <div className="ui segment">
          <div className="four ui buttons">
            <button className="ui teal button">Сортирай <font color="yellow">{this.state.allEvents.length}</font> клетки за деня</button>
            <button className="ui button" onClick={this.handleFilterTime}>
            <i className="icon clock"></i> по час
            </button>
            <button className="ui button" onClick={this.handleFilterTown}>
            <i className="icon map"></i> по град
            </button>
          </div>
        </div>
        <br />
        {this.state.allEvents.map((event, event_i) => {
          return (
            <div className="ui three column grid" key={event_i}>
              <div className="row">
                <div className="column">
                  <div className="ui vertical fluid menu">
                    <div className="header item">
                      <Link to={"/event/"+event._id} className="left aligned" title={"от "+ event.time +" на "+ event.location}>
                        <div className="fluid ui animated fade blue button" tabindex="0">
                          <div className="hidden content">виж повече</div>
                          <div className="visible content">
                            от {event.time}, на {event.location}
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="column">
                  <div className="ui segment">
                    <div className="ui list">
                      {event.format === "5v5"
                        ? event.players
                            .filter(function(item) {
                              return item.slot <= 5;
                            })
                            .sort(function(a, b){
                              return a.slot - b.slot;
                            })
                            .map((player, player_i) => {
                              return (
                                <div className={'item ' + (player.locked === true ? ' disabled' : '')} title={(player.locked === true ? 'мястото е запазено' : '')} key={player_i}>
                                  {player.locked === true || player.name !== "Empty"? <img className="ui avatar image" src="https://cdn1.iconfinder.com/data/icons/user-pictures/100/male3-128.png" alt="male"/>:<img className="ui avatar image" src="https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-128.png" alt="unknown"/>} 
                                  <div className="content">
                                    {player.name === "Empty" && player.locked === false? 
                                    <Popup
                                      key={player.player_i}
                                      trigger={<a className="header" playerid={player._id} slotid={player.slot} eventid={event._id} onClick={this.joinEvent}>място</a>}
                                      content="Включи се в играта!"
                                    />
                                    : 
                                    <a className="header">{player.name}</a>
                                    }
                                    <div className="description">
                                      {player.isGk === true? "вратар" : "полеви"}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                        : event.players
                            .filter(function(item) {
                              return item.slot <= 6;
                            })
                            .sort(function(a, b){
                              return a.slot - b.slot;
                            })
                            .map((player, player_i) => {
                              return (
                                <div className={'item ' + (player.locked === true ? ' disabled' : '')} title={(player.locked === true ? 'мястото е запазено' : '')} key={player_i}>
                                {player.locked === true || player.name !== "Empty"? <img className="ui avatar image" src="https://cdn1.iconfinder.com/data/icons/user-pictures/100/male3-128.png" alt="male"/>:<img className="ui avatar image" src="https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-128.png" alt="unknown"/>} 
                                <div className="content">
                                  {player.name === "Empty" && player.locked === false? 
                                  <Popup
                                    key={player.player_i}
                                    trigger={<a className="header" playerid={player._id} slotid={player.slot} eventid={event._id} onClick={this.joinEvent}>място</a>}
                                    content="Включи се в играта!"
                                  />
                                  : 
                                  <a className="header">{player.name}</a>
                                  }
                                  <div className="description">
                                    {player.isGk === true? "вратар" : "полеви"}
                                  </div>
                                </div>
                              </div>
                              );
                            })}
                    </div>
                  </div>
                </div>
                <div className="column">
                  <div className="ui segment">
                    <div className="ui list">
                    {event.format === "5v5"
                      ? event.players
                          .filter(function(item) {
                            return item.slot > 5 && item.slot <= 10;
                          })
                          .sort(function(a, b){
                            return a.slot - b.slot;
                          })
                          .map((player, player_i) => {
                            return (
                              <div className={'item ' + (player.locked === true ? ' disabled' : '')} title={(player.locked === true ? 'мястото е запазено' : '')} key={player_i}>
                                  {player.locked === true || player.name !== "Empty"? <img className="ui avatar image" src="https://cdn1.iconfinder.com/data/icons/user-pictures/100/male3-128.png" alt="male"/>:<img className="ui avatar image" src="https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-128.png" alt="unknown"/>} 
                                  <div className="content">
                                    {player.name === "Empty" && player.locked === false? 
                                    <Popup
                                      key={player.player_i}
                                      trigger={<a className="header" playerid={player._id} slotid={player.slot} eventid={event._id} onClick={this.joinEvent}>място</a>}
                                      content="Включи се в играта!"
                                    />
                                    : 
                                    <a className="header">{player.name}</a>
                                    }
                                    <div className="description">
                                      {player.isGk === true? "вратар" : "полеви"}
                                    </div>
                                  </div>
                                </div>
                            );
                          })
                      : event.players
                          .filter(function(item) {
                            return item.slot > 6 && item.slot <= 12;
                          })
                          .sort(function(a, b){
                            return a.slot - b.slot;
                          })
                          .map((player, player_i) => {
                            return (
                              <div className={'item ' + (player.locked === true ? ' disabled' : '')} title={(player.locked === true ? 'мястото е запазено' : '')} key={player_i}>
                                  {player.locked === true || player.name !== "Empty"? <img className="ui avatar image" src="https://cdn1.iconfinder.com/data/icons/user-pictures/100/male3-128.png" alt="male"/>:<img className="ui avatar image" src="https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-128.png" alt="unknown"/>} 
                                  <div className="content">
                                    {player.name === "Empty" && player.locked === false? 
                                    <Popup
                                      key={player.player_i}
                                      trigger={<a className="header" playerid={player._id} slotid={player.slot} eventid={event._id} onClick={this.joinEvent}>място</a>}
                                      content="Включи се в играта!"
                                    />
                                    : 
                                    <a className="header">{player.name}</a>
                                    }
                                    <div className="description">
                                      {player.isGk === true? "вратар" : "полеви"}
                                    </div>
                                  </div>
                                </div>
                            );
                          })}
                  </div>
                </div>
              </div>
              </div>
              {this.state.allEvents.length -1 !== event_i?
              <div className="ui horizontal divider">
                <i className="futbol icon"></i>
              </div>
              :
              ""
              }
            </div>
          );
        })}
        {this.state.allEvents.length < 1 &&
        <div className="ui black inverted center aligned segment">
          Няма активни клетки днес.
          <br />
          {this.props.user? `Можете да организирате сега.`: `Влезте в системата, за да организирате.`}
          <br />
          <br />
          {createLink}
        </div>
        }
      </div>
    );
  }
}
