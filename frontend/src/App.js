import React, { Component } from "react";
import "./App.css";

import { auth, facebook } from "./api/firebase";

import { Switch, Route, Link, withRouter } from "react-router-dom";

import HomePage from "./components/HomePage";
import NotFoundPage from "./components/NotFoundPage";
import CreateEvent from "./components/CreateEvent";
import ManageEvent from "./components/ManageEvent";
import EditEvent from "./components/EditEvent";
import ProfilePage from "./components/ProfilePage";
import EventPage from "./components/Event";
import SchedulePage from "./components/Schedule";
import AdminPage from "./components/AdminPage";

class App extends Component {
  constructor() {
    super();

    this.state = {
      user: null,
      userToken: null
    };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ 
          user
        });

        user.getIdToken().then(userToken => {
          this.setState({
            userToken
          });
        });
      }
    });
  }

  logout() {
    auth.signOut().then(() => {
      this.setState({
        user: null,
        userToken: null
      });

      this.props.history.push("/");
    });
  }

  login() {
    auth.signInWithPopup(facebook).then(result => {

      const user = result.user;
      console.log(user)
      this.setState({
        user
      });

      result.user.getIdToken().then(userToken => {
        this.setState({
          userToken
        });
      });
    });
  }

  render() {
    return (
      <div>
        <div className="ui attached stackable menu">
          <div className="ui container">
            <div className="item">
              <img className="ui mini rounded image" src="/images/kletki-logo-white.png" alt="logo"/>
            </div>
            <div className="item">
              <Link to="/">Начало</Link>
            </div>
            <div className="item">
              <Link to="/schedule">Календар</Link>
            </div>
            {this.state.user && (
              <div className="item">
                <Link to="/create">Организирай</Link>
              </div>
            )}
            {this.state.user && (
              <div className="item">
                <Link to="/manage">Настройки</Link>
              </div>
            )}
            {this.state.user && this.state.user.providerData[0].uid === "1680141592023114" && (
              <div className="item">
                <Link to="/admin">Администрирай</Link>
              </div>
            )}
            {this.state.user && (
              <div className="item" onClick={this.logout}>
                <a>Излез</a>
              </div>
            )}
            {this.state.user ?
              <div className="right item">
                <Link to="/profile" className="ui blue button">
                  <img
                    className="ui avatar image"
                    src={this.state.user.photoURL + "?type=small"}
                    alt="avatar"
                  />
                  <span>{this.state.user.displayName}</span>
                </Link>
              </div>
            :
              <div className="right item" onClick={this.login}>
                <a className="ui blue button">
                  <img
                    className="ui avatar image"
                    src="/images/guest.png"
                    alt="guest"
                  />
                  <span>Влез</span>
                </a>
              </div>
            }
          </div>
        </div>
        <div className="ui container">
          <br />
          <Switch>
            <Route
              exact
              path="/"
              render={props => <HomePage {...props} user={this.state.user} userToken={this.state.userToken} />}
            />
            <Route
              path="/schedule"
              render={props => <SchedulePage {...props} user={this.state.user} userToken={this.state.userToken} />}
            />
            <Route
              path="/event/:id"
              render={props => <EventPage {...props} user={this.state.user} userToken={this.state.userToken} />}
            />
            {this.state.user && (
              <Route
                path="/create"
                render={props => (
                  <CreateEvent {...props} user={this.state.user} userToken={this.state.userToken} />
                )}
              />
            )}
            {this.state.user && (
              <Route
                path="/manage"
                render={props => (
                  <ManageEvent {...props} user={this.state.user} userToken={this.state.userToken} />
                )}
              />
            )}
            {this.state.user && (
              <Route
                path="/edit/:id"
                render={props => (
                  <EditEvent {...props} user={this.state.user} userToken={this.state.userToken} />
                )}
              />
            )}
            {this.state.user && (
              <Route
                path="/profile"
                render={props => (
                  <ProfilePage {...props} user={this.state.user} userToken={this.state.userToken} />
                )}
              />
            )}
            {this.state.user && this.state.user.uid === "Ack4GDLzKNWbSzOQ9Jbg9tcOnJz1" && (
              <Route
                path="/admin"
                render={props => (
                  <AdminPage {...props} user={this.state.user} userToken={this.state.userToken} />
                )}
              />
            )}
            <Route component={NotFoundPage} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default withRouter(App);
