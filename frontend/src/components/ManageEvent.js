import React, { Component } from "react";
import { Link } from "react-router-dom";
import { fetchAllEventsManage, deleteEvent } from "./../api/request";

import sortBy from "sort-by";
import moment from "moment-timezone";

const todayDate = moment()
  .tz("Europe/Sofia")
  .format("YYYY-MM-DD");
const todayTime = moment()
  .tz("Europe/Sofia")
  .format("HH:mm");

export default class ManageEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allEvents: [],
      canManageUser: this.props.user
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  componentWillMount() {

    fetchAllEventsManage(this.props.user.providerData[0].uid, this.props.userToken)
      .then(response => response.json())
      .then(data => {
        this.setState({
          allEvents: data
            .sort(sortBy("-date", "time", "location"))
        });
      });
  }

  componentWillUnmount() {
    this.setState({
      allEvents: [],
      canManageUser: ""
    });
  }

  handleDelete(e) {
    if (this.props.user) {

      let eventsAuthor = this.props.user.email;
      let confirmDelete = window.confirm("Сигурен ли сте?");

      if (confirmDelete === true) {
        
        deleteEvent(e.target.id, this.props.userToken).then(() => {
          fetchAllEventsManage(this.props.user.providerData[0].uid, this.props.userToken)
            .then(response => response.json())
            .then(data => {
              this.setState({
                allEvents: data.filter(function(event) {
                  return event.author === eventsAuthor;
                })
              });
            });
        });
      }
    }
  }

  handleEdit(e) {
    if (this.props.user) {
      this.props.history.push("/edit/" + e.target.id);
    }
  }

  render() {
    return (
        <div className="ui cards">
        {this.state.allEvents.map((event, i) => {
          return (
            <div key={i} className="card">
              <div className="content">
                <img
                  className="right floated mini ui image"
                  src="/images/cup.png"
                  alt="cup"
                />
                <div className="header">
                  Клетка - {event.format}
                </div>
                <div className="meta">{event.location}</div>
                <div className="description">
                  Събитието е насрочено за {event.date} от {event.time}.
                </div>
                </div>
                <div className="extra content">
                  <div className="ui three buttons">
                    {(todayDate === event.date &&
                      moment(todayTime, "HH:mm").isBefore(
                        moment(event.time, "HH:mm")
                      ) === true) ||
                    moment(todayDate, "YYYY-MM-DD").isBefore(
                      moment(event.date, "YYYY-MM-DD")
                    ) === true ? (
                      <button
                        className="ui icon green button"
                        id={event._id}
                        onClick={this.handleEdit}
                      >
                        <i className="pencil alternate icon" />
                      </button>
                    ) : (
                      <button className="ui green button" disabled>
                        <i className="pencil alternate icon" />
                      </button>
                    )}
                    <Link to={"/event/"+event._id} className="ui blue button">
                        <i className="globe icon" />
                    </Link>
                    {(todayDate === event.date &&
                      moment(todayTime, "HH:mm").isBefore(
                        moment(event.time, "HH:mm")
                      ) === true) ||
                    moment(todayDate, "YYYY-MM-DD").isBefore(
                      moment(event.date, "YYYY-MM-DD")
                    ) === true ? (
                      <button
                        className="ui red button"
                        id={event._id}
                        onClick={this.handleDelete}
                      >
                        <i className="trash icon" />
                      </button>
                    ) : (
                      <button className="ui red button" disabled>
                        <i className="trash icon" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
          );
        })}
        {this.state.allEvents.length === 0 ? (
          <div className="ui segment">
            Няма събития, които да управлявате.
            <br />
            <Link to="create">Създайте ново събитие.</Link>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
