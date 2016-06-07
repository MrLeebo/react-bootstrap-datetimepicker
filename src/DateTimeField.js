import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import classnames from "classnames";
import DateTimePicker from "./DateTimePicker.js";
import Constants from "./Constants.js";

export default class DateTimeField extends Component {
  static defaultProps = {
    dateTime: moment().format("x"),
    format: "x",
    showToday: true,
    viewMode: "days",
    daysOfWeekDisabled: [],
    size: Constants.SIZE_MEDIUM,
    mode: Constants.MODE_DATETIME,
    zIndex: 999,
    onChange: (x) => {
      console.log(x);
    }
  }

  resolvePropsInputFormat = () => {
    if (this.props.inputFormat) { return this.props.inputFormat; }
    switch (this.props.mode) {
      case Constants.MODE_TIME:
        return "h:mm A";
      case Constants.MODE_DATE:
        return "MM/DD/YY";
      case Constants.MODE_MONTH:
        return "MM/YY";
      default:
        return "MM/DD/YY h:mm A";
    }
  }

  static propTypes = {
    dateTime: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(moment)
    ]),
    onChange: PropTypes.func,
    format: PropTypes.string,
    inputProps: PropTypes.object,
    inputFormat: PropTypes.string,
    defaultText: PropTypes.string,
    mode: PropTypes.oneOf([Constants.MODE_DATE, Constants.MODE_MONTH, Constants.MODE_DATETIME, Constants.MODE_TIME]),
    minDate: PropTypes.object,
    maxDate: PropTypes.object,
    direction: PropTypes.string,
    showToday: PropTypes.bool,
    viewMode: PropTypes.string,
    zIndex: PropTypes.number,
    size: PropTypes.oneOf([Constants.SIZE_SMALL, Constants.SIZE_MEDIUM, Constants.SIZE_LARGE]),
    daysOfWeekDisabled: PropTypes.arrayOf(PropTypes.number),
    isValid: PropTypes.bool
  }

  state = {
      showDatePicker: this.props.mode !== Constants.MODE_TIME,
      showTimePicker: this.props.mode === Constants.MODE_TIME,
      inputFormat: this.resolvePropsInputFormat(),
      buttonIcon: this.props.mode === Constants.MODE_TIME ? "glyphicon-time" : "glyphicon-calendar",
      widgetStyle: {
        display: "block",
        position: "absolute",
        left: -9999,
        zIndex: "9999 !important"
      },
      viewDate: moment(this.props.dateTime, this.props.format, true).startOf("month"),
      selectedDate: moment(this.props.dateTime, this.props.format, true),
      inputValue: typeof this.props.defaultText !== "undefined" ? undefined : moment(this.props.dateTime, this.props.format, true).format(this.resolvePropsInputFormat()),
      isValid: true
  }

  componentWillReceiveProps = (nextProps) => {
    let state = {};
    if (nextProps.inputFormat !== this.props.inputFormat) {
        state.inputFormat = nextProps.inputFormat;
        state.inputValue = moment(nextProps.dateTime, nextProps.format, true).format(nextProps.inputFormat);
    }

    if (nextProps.dateTime !== this.props.dateTime && moment(nextProps.dateTime, nextProps.format, true).isValid()) {
      state.viewDate = moment(nextProps.dateTime, nextProps.format, true).startOf("month");
      state.selectedDate = moment(nextProps.dateTime, nextProps.format, true);
      state.inputValue = moment(nextProps.dateTime, nextProps.format, true).format(nextProps.inputFormat ? nextProps.inputFormat : this.state.inputFormat);
    }
    return this.setState(state);
  }

  formatValueForEvent(eventName, event) {
    const value = event.target == null ? event : event.target.value;

    this.setIsValid(this.checkIsValid(value));
    if (moment(value, this.state.inputFormat, true).isValid()) {
      this.setState({
        selectedDate: moment(value, this.state.inputFormat, true),
        viewDate: moment(value, this.state.inputFormat, true).startOf("month")
      });
    }

    return this.setState({
      inputValue: value
    }, function() {
      return this.props[eventName](moment(this.state.inputValue, this.state.inputFormat, true).format(this.props.format), value);
    });

  }

  onChange = event => {
    this.formatValueForEvent('onChange', event);
  };

  onBlur = event => {
    this.formatValueForEvent('onBlur', event);
  };

  checkIsValid = (value) => {
    return moment(value, this.state.inputFormat, true).isValid() || value === this.props.defaultText || value === '';
  }

  setIsValid = (isValid) => {
    return this.setState({
      isValid: isValid
    })
  }

  getValue = () => {
    return moment(this.state.inputValue, this.props.inputFormat, true).format(this.props.format);
  }

  setSelectedMonth = (e) => {
    const { target } = e;
    if (target.className && !target.className.match(/disabled/g)) {
      return this.setState({
        selectedDate: moment(this.state.viewDate.clone().toDate())
          .month(e.target.innerHTML).date(1)
          .hour(this.state.selectedDate.hours()).minute(this.state.selectedDate.minutes())
      }, function() {
        this.closePicker();
        this.props.onChange(this.state.selectedDate.format(this.props.format));
        return this.setState({
          inputValue: this.state.selectedDate.format(this.state.inputFormat)
        });
      });
    }
  }

  setSelectedDate = (e) => {
    const { target } = e;

    if (target.className && !target.className.match(/disabled/g)) {
      this.setIsValid(true);
      let month;
      if (target.className.indexOf("new") >= 0) month = this.state.viewDate.month() + 1;
      else if (target.className.indexOf("old") >= 0) month = this.state.viewDate.month() - 1;
      else month = this.state.viewDate.month();
      return this.setState({
        selectedDate: moment(this.state.viewDate.clone().toDate()).month(month).date(parseInt(e.target.innerHTML)).hour(this.state.selectedDate.hours()).minute(this.state.selectedDate.minutes())
      }, function() {
        this.closePicker();
        this.props.onChange(this.state.selectedDate.format(this.props.format));
        return this.setState({
          inputValue: this.state.selectedDate.format(this.state.inputFormat)
        });
      });
    }
  }

  setSelectedHour = (e) => {
    this.setIsValid(true);
    return this.setState({
      selectedDate: this.state.selectedDate.clone().hour(parseInt(e.target.innerHTML)).minute(this.state.selectedDate.minutes())
    }, function() {
      this.closePicker();
      this.props.onChange(this.state.selectedDate.format(this.props.format));
      return this.setState({
        inputValue: this.state.selectedDate.format(this.state.inputFormat)
      });
    });
  }

  setSelectedMinute = (e) => {
    this.setIsValid(true);
    return this.setState({
      selectedDate: this.state.selectedDate.clone().hour(this.state.selectedDate.hours()).minute(parseInt(e.target.innerHTML))
    }, function() {
      this.closePicker();
      this.props.onChange(this.state.selectedDate.format(this.props.format));
      return this.setState({
        inputValue: this.state.selectedDate.format(this.state.inputFormat)
      });
    });
  }

  setViewMonth = (month) => {
    return this.setState({
      viewDate: this.state.viewDate.clone().month(month)
    });
  }

  setViewYear = (year) => {
    return this.setState({
      viewDate: this.state.viewDate.clone().year(year)
    });
  }

  addMinute = () => {
    return this.setState({
      selectedDate: this.state.selectedDate.clone().add(1, "minutes")
    }, function() {
      this.props.onChange(this.state.selectedDate.format(this.props.format));
      return this.setState({
        inputValue: this.state.selectedDate.format(this.resolvePropsInputFormat())
      });
    });
  }

  addHour = () => {
    return this.setState({
      selectedDate: this.state.selectedDate.clone().add(1, "hours")
    }, function() {
      this.props.onChange(this.state.selectedDate.format(this.props.format));
      return this.setState({
        inputValue: this.state.selectedDate.format(this.resolvePropsInputFormat())
      });
    });
  }

  addMonth = () => {
    return this.setState({
      viewDate: this.state.viewDate.add(1, "months")
    });
  }

  addYear = () => {
    return this.setState({
      viewDate: this.state.viewDate.add(1, "years")
    });
  }

  addDecade = () => {
    return this.setState({
      viewDate: this.state.viewDate.add(10, "years")
    });
  }

  subtractMinute = () => {
    return this.setState({
      selectedDate: this.state.selectedDate.clone().subtract(1, "minutes")
    }, () => {
      this.props.onChange(this.state.selectedDate.format(this.props.format));
      return this.setState({
        inputValue: this.state.selectedDate.format(this.resolvePropsInputFormat())
      });
    });
  }

  subtractHour = () => {
    return this.setState({
      selectedDate: this.state.selectedDate.clone().subtract(1, "hours")
    }, () => {
      this.props.onChange(this.state.selectedDate.format(this.props.format));
      return this.setState({
        inputValue: this.state.selectedDate.format(this.resolvePropsInputFormat())
      });
    });
  }

  subtractMonth = () => {
    return this.setState({
      viewDate: this.state.viewDate.subtract(1, "months")
    });
  }

  subtractYear = () => {
    return this.setState({
      viewDate: this.state.viewDate.subtract(1, "years")
    });
  }

  subtractDecade = () => {
    return this.setState({
      viewDate: this.state.viewDate.subtract(10, "years")
    });
  }

  togglePeriod = () => {
    if (this.state.selectedDate.hour() > 12) {
      return this.onChange(this.state.selectedDate.clone().subtract(12, "hours").format(this.state.inputFormat));
    } else {
      return this.onChange(this.state.selectedDate.clone().add(12, "hours").format(this.state.inputFormat));
    }
  }

  togglePicker = () => {
    return this.setState({
      showDatePicker: !this.state.showDatePicker,
      showTimePicker: !this.state.showTimePicker
    });
  }

  setToday = () => {
    var today = moment();
    this.setIsValid(true);
    return this.setState({
      selectedDate: today,
    }, function() {
      this.closePicker();
      this.props.onChange(today);
      console.log(this.state.selectedDate)
      return this.setState({
        inputValue: this.state.selectedDate.format(this.resolvePropsInputFormat())
      });
    });
  }

  calculatePosition = (options) => {
    let classes, gBCR, offset, placePosition, scrollTop, styles, widgetOffsetHeight, clientHeight, height;

      classes = {};
      if(options) {
        classes["months"] = options.monthsDisplayed;
        classes["years"] = options.yearsDisplayed;
        classes["days"] = options.daysDisplayed;
        classes["time"] = options.timeDisplayed;
      }
      gBCR = this.refs.dtpbutton.getBoundingClientRect();

      offset = {
        top: gBCR.top + window.pageYOffset - document.documentElement.clientTop,
        left: 0
      };
      offset.top = offset.top + this.refs.datetimepicker.offsetHeight;
      //Support for both old version of react and new version (v1.4.2) of react
      //The new version of react return the child refs as a component rather than a DomNode
      widgetOffsetHeight = this.refs.widget.offsetHeight || ReactDOM.findDOMNode(this.refs.widget).offsetHeight;
      clientHeight = this.refs.widget.clientHeight || ReactDOM.findDOMNode(this.refs.widget).clientHeight;
      height =  this.refs.widget.height || ReactDOM.findDOMNode(this.refs.widget).height;

      scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
      placePosition = this.props.direction === "up" ? "top" : this.props.direction === "bottom" ? "bottom" : this.props.direction === "auto" ? offset.top + widgetOffsetHeight > window.offsetHeight + scrollTop && widgetOffsetHeight + this.refs.datetimepicker.offsetHeight > offset.top ? "top" : "bottom" : void 0;
      if (placePosition === "top") {
        offset.top = -widgetOffsetHeight - 2;
        classes.top = true;
        classes.bottom = false;
      } else {
        offset.top = 35;
        classes.top = false;
        classes.bottom = true;
      }
      styles = {
        display: "block",
        position: "absolute",
        top: offset.top,
        left: offset.left,
        right: 40
      };
      return this.setState({
        widgetStyle: styles,
        widgetClasses: classes
      });

  }

  onClick = () => {
    let displayOptions = {};

    if (this.state.showPicker) {
      return this.closePicker();
    } else {
      this.setState({
        showPicker: true
      });
      displayOptions.yearsDisplayed = (this.props.mode === 'year');
      displayOptions.monthsDisplayed = (this.props.mode === 'month');
      displayOptions.daysDisplayed = (this.props.mode === 'date');
      displayOptions.timeDisplayed = (this.props.mode === 'time');

      this.calculatePosition(displayOptions);
    }
  }

  closePicker = () => {
    let style = {...this.state.widgetStyle};
    style.left = -9999;
    style.display = "block";
    return this.setState({
      showPicker: false,
      widgetStyle: style
    });
  }

  size = () => {
    switch (this.props.size) {
      case Constants.SIZE_SMALL:
        return "form-group-sm";
      case Constants.SIZE_LARGE:
        return "form-group-lg";
    }

    return "";
  }

  renderOverlay = () => {
    const styles = {
      position: "fixed",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: `${this.props.zIndex}`
    };
    if (this.state.showPicker) {
      return (<div className='bootstrap-datetimepicker-overlay' onClick={this.closePicker} style={styles} />);
    } else {
      return <span />;
    }
  };

  render() {
    return (
          <div className="bootstrap-datetimepicker-wrap">
            {this.renderOverlay()}
            <DateTimePicker
                  addDecade={this.addDecade}
                  addHour={this.addHour}
                  addMinute={this.addMinute}
                  addMonth={this.addMonth}
                  addYear={this.addYear}
                  daysOfWeekDisabled={this.props.daysOfWeekDisabled}
                  maxDate={this.props.maxDate}
                  minDate={this.props.minDate}
                  mode={this.props.mode}
                  ref="widget"
                  selectedDate={this.state.selectedDate}
                  setSelectedMonth={this.setSelectedMonth}
                  setSelectedDate={this.setSelectedDate}
                  setSelectedHour={this.setSelectedHour}
                  setSelectedMinute={this.setSelectedMinute}
                  setViewMonth={this.setViewMonth}
                  setViewYear={this.setViewYear}
                  setToday={this.setToday}
                  showDatePicker={this.state.showDatePicker}
                  showTimePicker={this.state.showTimePicker}
                  showToday={this.props.showToday}
                  subtractDecade={this.subtractDecade}
                  subtractHour={this.subtractHour}
                  subtractMinute={this.subtractMinute}
                  subtractMonth={this.subtractMonth}
                  subtractYear={this.subtractYear}
                  togglePeriod={this.togglePeriod}
                  togglePicker={this.togglePicker}
                  viewDate={this.state.viewDate}
                  viewMode={this.props.viewMode}
                  widgetClasses={this.state.widgetClasses}
                  widgetStyle={this.state.widgetStyle}
                  calculatePosition={this.calculatePosition}
            />
            <div className={classnames("input-group date " + this.size(), {"has-error": !this.state.isValid})} ref="datetimepicker">
              <input className="form-control" onChange={this.onChange} onBlur={this.onBlur} type="text" value={this.state.inputValue} {...this.props.inputProps} ref="inputDateTime" placeholder={this.props.defaultText}/>
              <span className="input-group-addon" onBlur={this.onBlur} onClick={this.onClick} ref="dtpbutton">
                <span className={classnames("glyphicon", this.state.buttonIcon)} />
              </span>
            </div>
          </div>
    );
  }
}
