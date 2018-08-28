import React, { Component } from "react"
import sortBy from "sort-by"

import { fetchAllAdminEvents, deleteEventAdmin } from "./../api/request";

export default class AdminPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allEvents: []
        };

        this.deleteEvent = this.deleteEvent.bind(this)
    }

    componentDidMount() {

        setTimeout(() => {
            if (this.props.user) {
                fetchAllAdminEvents(this.props.user.uid, this.props.userToken)
                    .then(response => response.json())
                    .then(data => {
                        this.setState({
                            allEvents: data
                                .sort(sortBy("-date", "time", "location"))
                        });
                    })
            }
        }, 1000);
    }

    componentWillUnmount() {
        this.setState({
            allEvents: []
        });
    }

    deleteEvent(e) {
        if (this.props.user) {

            let confirmDelete = window.confirm("Сигурен ли сте?");
      
            if (confirmDelete === true) {
              
              deleteEventAdmin(e.target.id, this.props.user.uid, this.props.userToken).then(() => {
                fetchAllAdminEvents(this.props.user.uid, this.props.userToken)
                    .then(response => response.json())
                    .then(data => {
                        this.setState({
                            allEvents: data
                                .sort(sortBy("-date", "time", "location"))
                        });
                    })
              });
            }
          }
    }

    render() {
        return (
            <div className="ui relaxed divided list">
                {this.state.allEvents.map((event, i) => {
                    return (
                        <div className="item" key={i}>
                            <div className="right floated content">
                                <div 
                                    id={event._id}
                                    onClick={this.deleteEvent}
                                    className="ui red button">
                                    Изтрий
                            </div>
                            </div>
                            <i className="large trophy middle aligned icon"></i>
                            <div className="content">
                                <a className="header">гр./с. {event.town}, {event.location}</a>
                                <div className="description">орг. {event.author_fb_name}</div>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}