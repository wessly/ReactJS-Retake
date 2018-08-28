import React, { Component } from "react"
import { withRouter } from "react-router-dom";
import { fetchAllEventsSchedule } from "./../api/request";
import BigCalendar from 'react-big-calendar';
import moment from 'moment-timezone';
import 'react-big-calendar/lib/css/react-big-calendar.css';

moment.locale('bg');
BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))

const allViews = Object
    .keys(BigCalendar.Views)
    .map(k => BigCalendar.Views[k]);

class Schedule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            events: []
        }
    }

    componentWillMount() {
        fetchAllEventsSchedule()
            .then(response => response.json())
            .then(data => {
                this.setState({
                    events: data
                });
            })
    }

    render() {
        return (<div style={{ height: 700 }}>
            {this.state.events &&
                <BigCalendar
                    culture="bg"
                    events={this.state.events}
                    views={allViews}
                    defaultView="month"
                    toolbar={false}
                    popup={true}
                    onSelectEvent={event => this.props.history.push("/event/"+event.eventid)}
                    className="ui segment"
                />
            }
            <br />
        </div>);
    }
}

export default withRouter(Schedule);