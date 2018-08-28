import React, { Component } from "react";
import { createEvent } from "./../api/request";

import moment from "moment";
import TimePicker from "rc-time-picker";

import 'rc-time-picker/assets/index.css';

const showSeconds = false;
const allowEmptyTime = false;
const timeStr = showSeconds ? 'HH:mm:ss' : 'HH:mm';

export default class CreateEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      town: "",
      townName: "",
      location: "",
      date: "",
      time: "",
      format: "",
      author: this.props.user.email,
      submitDisabled: true,
      townNameVisible: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleProceed = this.handleProceed.bind(this);
  }

  componentWillUnmount() {
    this.setState({
      town: "",
      townName: "",
      location: "",
      date: "",
      time: "",
      format: "",
      author: this.props.user.email,
      submitDisabled: true,
      townNameVisible: false
    });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (
        this.state.town.toString().trim() !== "Друг град/село"
        && this.state.location.toString().trim().length > 4
        && this.state.date !== ""
        && this.state.time !== ""
        && this.state.format !== ""
        && this.state.author.toString().trim().length > 5
      ) {
        this.setState({
          submitDisabled: false
        })
      } else if (
        this.state.town.toString().trim() === "Друг град/село" 
        && this.state.townName.length > 1
        && this.state.location.toString().trim().length > 4
        && this.state.date !== ""
        && this.state.time !== ""
        && this.state.format !== ""
        && this.state.author.toString().trim().length > 5
      ) {
        this.setState({
          submitDisabled: false
        })
      } else {
        this.setState({
          submitDisabled: true
        })
      }

      if (this.state.town.toString().trim() === "Друг град/село") {
        this.setState({
          townNameVisible: true
        });
      } else {
        this.setState({
          townNameVisible: false
        });
      }
    });
  }

  handleChangeTime(value) {
    this.setState({ time: value.format(timeStr) }, () => {
      if (
        this.state.town.toString().trim() !== "Друг град/село"
        && this.state.location.toString().trim().length > 4
        && this.state.date !== ""
        && this.state.time !== ""
        && this.state.format !== ""
        && this.state.author.toString().trim().length > 5
      ) {
        this.setState({
          submitDisabled: false
        })
      } else if (
        this.state.town.toString().trim() === "Друг град/село" 
        && this.state.townName.length > 1
        && this.state.location.toString().trim().length > 4
        && this.state.date !== ""
        && this.state.time !== ""
        && this.state.format !== ""
        && this.state.author.toString().trim().length > 5
      ) {
        this.setState({
          submitDisabled: false
        })
      } else {
        this.setState({
          submitDisabled: true
        })
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  handleProceed() {

    if (this.props.user) {
      if (this.state.town.toString().trim() === "Друг град/село"
        && this.state.townName.length > 1) {
        createEvent({
          town: this.state.townName,
          location: this.state.location,
          date: this.state.date,
          time: this.state.time,
          format: this.state.format,
          author: this.state.author,
          author_fb_id: this.props.user.providerData[0].uid,
          author_fb_name: this.props.user.displayName
        }, this.props.userToken)
          .then(() => {
            setTimeout(() => {
              this.props.history.push("/");
            }, 500);
          });
      } else {
        createEvent({
          town: this.state.town,
          location: this.state.location,
          date: this.state.date,
          time: this.state.time,
          format: this.state.format,
          author: this.state.author,
          author_fb_id: this.props.user.providerData[0].uid,
          author_fb_name: this.props.user.displayName
        }, this.props.userToken)
          .then(() => {
            setTimeout(() => {
              this.props.history.push("/");
            }, 500);
          });
      }
    }
  }

  render() {
    return (
      <div>
        <div className="ui segment">
          <form className="ui form" onSubmit={this.handleSubmit}>

            <div className="field">
              <label>
                <a className="subLabel">
                  населено място, в който ще се проведе събитието
                </a>
              </label>
              <select
                className="ui fluid dropdown"
                name="town"
                value={this.state.town}
                onChange={this.handleChange}>
                <option value="">Избери</option>
                <option value="Друг град/село">Друг град/село</option>
                <option value="Blagoevgrad">Благоевград</option>
                <option value="Burgas">Бургас</option>
                <option value="Varna">Варна</option>
                <option value="Veliko Turnovo">Велико Търново</option>
                <option value="Vidin">Видин</option>
                <option value="Vratsa">Враца</option>
                <option value="Gabrovo">Габрово</option>
                <option value="Dobrich">Добрич</option>
                <option value="Kardzhali">Кърджали</option>
                <option value="Kyustendil">Кюстендил</option>
                <option value="Lovech">Ловеч</option>
                <option value="Montana">Монтана</option>
                <option value="Pazardzhik">Пазарджик</option>
                <option value="Pernik">Перник</option>
                <option value="Pleven">Плевен</option>
                <option value="Plovdiv">Пловдив</option>
                <option value="Razgrad">Разград</option>
                <option value="Ruse">Русе</option>
                <option value="Silistra">Силистра</option>
                <option value="Sliven">Сливен</option>
                <option value="Smolyan">Смолян</option>
                <option value="Sofiya">София</option>
                <option value="Stara Zagora">Стара Загора</option>
                <option value="Turgovishte">Търговище</option>
                <option value="Khaskovo">Хасково</option>
                <option value="Shumen">Шумен</option>
                <option value="Yambol">Ямбол</option>
              </select>
              {this.state.townNameVisible &&
                <div>
                  <br />
                  <input
                  type="text"
                  name="townName"
                  placeholder="Посочете името на града или селото"
                  value={this.state.townName}
                  onChange={this.handleChange} />
                </div>
              }
            </div>

            <div className="field">
              <label>
                <a className="subLabel">
                  опитайте, да бъдете максимално точни в описанието, за да не се получат обърквания
                </a>
              </label>
              <div className="ui left icon input">
                <input
                  type="text"
                  name="location"
                  placeholder="Местоположение, игрище или име на спортен комплекс"
                  value={this.state.location}
                  onChange={this.handleChange} />
                <i className="map icon"></i>
              </div>
            </div>

            <div className="field">
              <label>
                <a className="subLabel">
                  задайте датата, на коята ще се организира клетката
                </a>
              </label>
              <div className="ui left icon input">
                <input
                  type="date"
                  name="date"
                  value={this.state.date}
                  onChange={this.handleChange} />
                <i className="calendar icon"></i>
              </div>
            </div>

            <div className="field">
              <label>
                <a className="subLabel">
                  точен час, в който ще се проведе събитието
                </a>
              </label>
              <div className="ui left icon input">
                <TimePicker
                  style={{ width: 100 }}
                  showSecond={showSeconds}
                  allowEmpty={allowEmptyTime}
                  defaultValue={moment()}
                  onChange={this.handleChangeTime}
                />
                <i className="clock icon"></i>
              </div>
            </div>

            <div className="field">
              <label>
                <a className="subLabel">
                  формат за игра, колко на колко човека ще играете
                </a>
              </label>
              <select
                className="ui fluid dropdown"
                name="format"
                value={this.state.format}
                onChange={this.handleChange}>
                <option value="">Избери</option>
                <option value="5v5">5 на 5</option>
                <option value="6v6">6 на 6</option>
              </select>
            </div>
            <br />
            <button
              className="ui labeled icon blue button"
              type="submit"
              onClick={this.handleProceed}
              disabled={this.state.submitDisabled}>
              <i className="check icon"></i>
              Напред
            </button>
          </form>
        </div>
      </div>
    );
  }
}
