import React, { Component } from "react";
import { fetchUserInfo } from "../api/request";

export default class ProfilePage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            events_created: 0,
            favourite_player: {}
        }
    }

    componentWillMount() {

        fetchUserInfo(this.props.user.email, this.props.userToken)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    events_created: data.events_created,
                    favourite_player: data.favourite_player
                });
            });
    }

    render() {
        return (<div>
            <div className="ui grid">
                <div className="five wide column">
                    <center>
                        <img
                            className="ui small circular image"
                            src={this.props.user.photoURL + "?type=large"} 
                            alt="profile" />
                        <h3>{this.props.user.displayName}</h3>
                        {this.props.user.email}
                    </center>
                </div>
                <div className="one wide column"></div>
                <div className="ten wide column">
                    <table className="ui definition table">
                        <thead>
                            <tr><th></th>
                                <th>Информация</th>
                            </tr></thead>
                        <tbody>
                            <tr>
                                <td>организирани клетки</td>
                                <td>{this.state.events_created}</td>
                            </tr>
                            <tr>
                                <td>най-често играе със</td>
                                <td>{this.state.favourite_player.name && this.state.favourite_player.games !== 0?
                                    <div>
                                        {this.state.favourite_player.name} ({this.state.favourite_player.games} игри)
                                    </div>
                                    : 
                                    '-'}
                                </td>
                            </tr>
                        </tbody></table>
                </div>
            </div>
        </div>)
    }
}
