import React, { Component } from "react";
import {
  fetchOneEvent,
  editEvent,
  updatePlayer,
  updatePlayerGk,
  invitePlayers
} from "./../api/request";

import { Popup } from 'semantic-ui-react';

import moment from "moment";
import TimePicker from "rc-time-picker";

import 'rc-time-picker/assets/index.css';

const showSeconds = false;
const allowEmptyTime = false;
const timeStr = showSeconds ? 'HH:mm:ss' : 'HH:mm';

export default class EditComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      eventid: "",
      location: "",
      date: "",
      time: "",
      format: "",
      author: "",
      created_at: "",
      players: [],
      inviting: false,
      submitDisabled: false,
      showForm: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.updatePlayer = this.updatePlayer.bind(this);
    this.updateGkPlayer = this.updateGkPlayer.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleProceed = this.handleProceed.bind(this);
    this.showEditForm = this.showEditForm.bind(this);
    this.handleInvitePlayers = this.handleInvitePlayers.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (
        this.state.location.toString().trim().length > 4 &&
        this.state.date !== "" &&
        this.state.format !== "" &&
        this.state.author.toString().trim().length > 5 &&
        this.state.players !== null
      ) {
        this.setState({
          submitDisabled: false
        });
      } else {
        this.setState({
          submitDisabled: true
        });
      }
    });
  }

  handleChangeTime(value) {

    this.setState({ time: value.format(timeStr) }, () => {
      if (this.state.time !== "") {
        this.setState({
          submitDisabled: false
        });
      } else {
        this.setState({
          submitDisabled: true
        });
      }
    });
  }

  updatePlayer(e) {
    if (this.props.user && this.props.user.email === this.state.author) {
      if (e.target.getAttribute("locked") !== true) {
        var updateObj = prompt(
          "Напиши името на новия играч",
          e.target.getAttribute("name")
        );

        if (updateObj !== null && updateObj.length >= 2) {
          let payload = {
            name: updateObj,
            locked: e.target.getAttribute("locked")
          };

          updatePlayer(e.target.getAttribute("id"), payload, this.props.user.providerData[0].uid, this.props.userToken).then(() => {
            fetchOneEvent(this.props.match.params.id)
              .then(response => response.json())
              .then(data => {
                this.setState({
                  location: data.location,
                  date: data.date,
                  players: data.players.sort(function (a, b) {
                    return a.slot - b.slot;
                  })
                });
              });
          });
        }
      }
    }
  }

  updateGkPlayer(e) {
    if (this.props.user && this.props.user.email === this.state.author) {
      let updateObj = window.confirm("Променяш му позицията?");

      if (updateObj === true) {
        updatePlayerGk(e.target.getAttribute("id"), this.props.user.providerData[0].uid, this.props.userToken).then(() => {
          fetchOneEvent(this.props.match.params.id)
            .then(response => response.json())
            .then(data => {
              this.setState({
                location: data.location,
                date: data.date,
                players: data.players.sort(function (a, b) {
                  return a.slot - b.slot;
                })
              });
            });
        });
      }
    }
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  handleProceed() {
    if (this.props.user && this.props.user.email === this.state.author) {
      let payload = {
        location: this.state.location,
        date: this.state.date,
        time: this.state.time
      };

      editEvent(this.props.match.params.id, payload, this.props.user.providerData[0].uid, this.props.userToken).then(() => {
        this.props.history.push("/");
      });
    }
  }

  handleInvitePlayers(e) {
    if (this.props.user && this.props.user.email === this.state.author) {

      invitePlayers(this.props.match.params.id, this.props.user.providerData[0].uid, this.props.userToken).then(() => {
        fetchOneEvent(this.props.match.params.id)
        .then(response => response.json())
        .then(data => {
          this.setState({
            inviting: data.inviting
          });
        });
      });
    }
  }

  componentWillMount() {
    fetchOneEvent(this.props.match.params.id)
      .then(response => response.json())
      .then(data => {
        this.setState({
          eventid: data._id,
          location: data.location,
          date: data.date,
          time: data.time,
          format: data.format,
          author: data.author,
          created_at: data.created_at,
          players: data.players.sort(function (a, b) {
            return a.slot - b.slot;
          }),
          inviting: data.inviting
        });
      });
  }

  showEditForm() {
    this.setState({
      showForm: true
    });
  }

  render() {
    return (
      <div className="ui segment">
        <div className="ui grid">
          <div className="twelve wide column">
            <h1>Редактирай клетката</h1>
            <br />
            {this.state.showForm === false ? (
              <div>
                <button 
                  onClick={this.showEditForm} 
                  className="ui labeled icon green button">
                    <i class="pencil alternate icon"></i>
                    Промени местоположение/дата/час
                  </button>
                <br />
                <br />
              </div>
            ) : (
                <form className="ui form" onSubmit={this.handleSubmit}>
                  <div className="field">
                    <label>Местоположение</label>
                    <input
                      type="text"
                      name="location"
                      value={this.state.location}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="field">
                    <label>Дата</label>
                    <input
                      type="date"
                      name="date"
                      value={this.state.date}
                      placeholder="Кога"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="field">
                    <label>Час</label>
                    <TimePicker
                      style={{ width: 100 }}
                      showSecond={showSeconds}
                      allowEmpty={allowEmptyTime}
                      defaultValue={moment()}
                      onChange={this.handleChangeTime}
                    />
                  </div>
                  Създадено в {this.state.created_at}
                  <br />
                  <br />
                  <button
                    className="ui green button"
                    type="submit"
                    onClick={this.handleProceed}
                    disabled={this.state.submitDisabled}
                  >
                    Промени
            </button>
                </form>
              )}
            <br />
            <center>
              <div className="ui horizontal list">
                {this.state.players
                  .filter(function (player) {
                    if (this.state.format === "5v5") {
                      return player.slot <= 5;
                    }
                    return player.slot <= 6;
                  }, this)
                  .map((player, i) => {
                    return (
                      <div className="item" key={i}>
                        <div className="content">
                          <Popup
                            key={player.name}
                            trigger={<a
                              id={player._id}
                              name={player.name}
                              locked={player.locked.toString()}
                              onClick={this.updatePlayer}
                            >
                              {player.name}
                            </a>}
                            content="Редактирай"
                          />
                          <br />
                          <br />
                          {player.locked === false ? (
                            <button
                              id={player._id}
                              name={player.name}
                              locked="true"
                              onClick={this.updatePlayer}
                              className="ui blue button"
                            >
                              запази
                        </button>
                          ) : (
                              <button
                                id={player._id}
                                name={player.name}
                                locked="false"
                                onClick={this.updatePlayer}
                                className="ui red button"
                              >
                                отключи
                        </button>
                            )}
                          <br />
                          {player.isGk === false ? (
                            <button
                              id={player._id}
                              name={player.name}
                              isgk="true"
                              onClick={this.updateGkPlayer}
                              className="ui teal button"
                            >
                              вратар
                        </button>
                          ) : (
                              <button
                                id={player._id}
                                name={player.name}
                                isgk="false"
                                onClick={this.updateGkPlayer}
                                className="ui orange button"
                              >
                                полеви
                        </button>
                            )}
                        </div>
                      </div>
                    );
                  })}
              </div>
              <br />
              <br />
              <div className="ui horizontal list">
                {this.state.players
                  .filter(function (player) {
                    if (this.state.format === "5v5") {
                      return player.slot >= 6 && player.slot <= 10;
                    }
                    return player.slot >= 7 && player.slot <= 12;
                  }, this)
                  .map((player, i) => {
                    return (
                      <div key={i} className="item">
                        <div className="content">
                          <a
                            id={player._id}
                            name={player.name}
                            locked={player.locked.toString()}
                            onClick={this.updatePlayer}
                            data-content="Редактирай"
                          >
                            {player.name}
                          </a>
                          <br />
                          <br />
                          {player.locked === false ? (
                            <button
                              id={player._id}
                              name={player.name}
                              locked="true"
                              onClick={this.updatePlayer}
                              className="ui blue button"
                            >
                              запази
                        </button>
                          ) : (
                              <button
                                id={player._id}
                                name={player.name}
                                locked="false"
                                onClick={this.updatePlayer}
                                className="ui red button"
                              >
                                отключи
                        </button>
                            )}
                          <br />
                          {player.isGk === false ? (
                            <button
                              id={player._id}
                              name={player.name}
                              isgk="true"
                              onClick={this.updateGkPlayer}
                              className="ui teal button"
                            >
                              вратар
                        </button>
                          ) : (
                              <button
                                id={player._id}
                                name={player.name}
                                isgk="false"
                                onClick={this.updateGkPlayer}
                                className="ui orange button"
                              >
                                полеви
                        </button>
                            )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </center>
          </div>
          <div className="four wide column">
            <h1>Покани играчи</h1>
            <br />
            {this.state.inviting === false? 
              <div>
                <button
                  className="ui compact labeled icon button"
                  onClick={this.handleInvitePlayers}>
                  <i class="plus icon"></i>
                  Търси играчи
                </button>
              </div>
              :
              "Търсят се играчи в момента."
            }
          </div>
        </div>
      </div>
    );
  }
}
