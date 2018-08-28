import React, { Component } from "react";
import { login } from "./../api/request";

export default class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handeLogin = this.handeLogin.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  async handeLogin() {
    let res = await login(this.state.username, this.state.password);

    if (res._kmd) {
      localStorage.setItem("authToken", res._kmd.authtoken);
      this.props.history.push("/");
    }
  }

  render() {
    return (
      <div>
        {this.state.username} - {this.state.password}
        <form onSubmit={this.handleSubmit}>
          <input
            name="username"
            type="text"
            value={this.state.username}
            onChange={this.handleChange}
            label="Username"
          />
          <input
            name="password"
            type="password"
            value={this.state.password}
            onChange={this.handleChange}
            label="Password"
          />
          <input type="button" value="Log In" onClick={this.handeLogin} />
        </form>
      </div>
    );
  }
}
