"use strict";

var _get = require("babel-runtime/helpers/get")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _extends = require("babel-runtime/helpers/extends")["default"];

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _DateTimePickerJs = require("./DateTimePicker.js");

var _DateTimePickerJs2 = _interopRequireDefault(_DateTimePickerJs);

var _ConstantsJs = require("./Constants.js");

var _ConstantsJs2 = _interopRequireDefault(_ConstantsJs);

var DateTimeField = (function (_Component) {
  _inherits(DateTimeField, _Component);

  function DateTimeField() {
    var _this = this;

    _classCallCheck(this, DateTimeField);

    _get(Object.getPrototypeOf(DateTimeField.prototype), "constructor", this).apply(this, arguments);

    this.resolvePropsInputFormat = function () {
      if (_this.props.inputFormat) {
        return _this.props.inputFormat;
      }
      switch (_this.props.mode) {
        case _ConstantsJs2["default"].MODE_TIME:
          return "h:mm A";
        case _ConstantsJs2["default"].MODE_DATE:
          return "MM/DD/YY";
        case _ConstantsJs2["default"].MODE_MONTH:
          return "MM/YY";
        default:
          return "MM/DD/YY h:mm A";
      }
    };

    this.state = {
      showDatePicker: this.props.mode !== _ConstantsJs2["default"].MODE_TIME,
      showTimePicker: this.props.mode === _ConstantsJs2["default"].MODE_TIME,
      inputFormat: this.resolvePropsInputFormat(),
      buttonIcon: this.props.mode === _ConstantsJs2["default"].MODE_TIME ? "glyphicon-time" : "glyphicon-calendar",
      widgetStyle: {
        display: "block",
        position: "absolute",
        left: -9999,
        zIndex: "9999 !important"
      },
      viewDate: (0, _moment2["default"])(this.props.dateTime, this.props.format, true).startOf("month"),
      selectedDate: (0, _moment2["default"])(this.props.dateTime, this.props.format, true),
      inputValue: typeof this.props.defaultText !== "undefined" ? undefined : (0, _moment2["default"])(this.props.dateTime, this.props.format, true).format(this.resolvePropsInputFormat()),
      isValid: true
    };

    this.componentWillReceiveProps = function (nextProps) {
      var state = {};
      if (nextProps.inputFormat !== _this.props.inputFormat) {
        state.inputFormat = nextProps.inputFormat;
        state.inputValue = (0, _moment2["default"])(nextProps.dateTime, nextProps.format, true).format(nextProps.inputFormat);
      }

      if (nextProps.dateTime !== _this.props.dateTime && (0, _moment2["default"])(nextProps.dateTime, nextProps.format, true).isValid()) {
        state.viewDate = (0, _moment2["default"])(nextProps.dateTime, nextProps.format, true).startOf("month");
        state.selectedDate = (0, _moment2["default"])(nextProps.dateTime, nextProps.format, true);
        state.inputValue = (0, _moment2["default"])(nextProps.dateTime, nextProps.format, true).format(nextProps.inputFormat ? nextProps.inputFormat : _this.state.inputFormat);
      }
      return _this.setState(state);
    };

    this.onChange = function (event) {
      _this.formatValueForEvent('onChange', event);
    };

    this.onBlur = function (event) {
      _this.formatValueForEvent('onBlur', event);
    };

    this.checkIsValid = function (value) {
      return (0, _moment2["default"])(value, _this.state.inputFormat, true).isValid() || value === _this.props.defaultText || value === '';
    };

    this.setIsValid = function (isValid) {
      return _this.setState({
        isValid: isValid
      });
    };

    this.getValue = function () {
      return (0, _moment2["default"])(_this.state.inputValue, _this.props.inputFormat, true).format(_this.props.format);
    };

    this.setSelectedMonth = function (e) {
      var target = e.target;

      if (target.className && !target.className.match(/disabled/g)) {
        return _this.setState({
          selectedDate: (0, _moment2["default"])(_this.state.viewDate.clone().toDate()).month(e.target.innerHTML).date(1).hour(_this.state.selectedDate.hours()).minute(_this.state.selectedDate.minutes())
        }, function () {
          this.closePicker();
          this.props.onChange(this.state.selectedDate.format(this.props.format));
          return this.setState({
            inputValue: this.state.selectedDate.format(this.state.inputFormat)
          });
        });
      }
    };

    this.setSelectedDate = function (e) {
      var target = e.target;

      if (target.className && !target.className.match(/disabled/g)) {
        _this.setIsValid(true);
        var month = undefined;
        if (target.className.indexOf("new") >= 0) month = _this.state.viewDate.month() + 1;else if (target.className.indexOf("old") >= 0) month = _this.state.viewDate.month() - 1;else month = _this.state.viewDate.month();
        return _this.setState({
          selectedDate: (0, _moment2["default"])(_this.state.viewDate.clone().toDate()).month(month).date(parseInt(e.target.innerHTML)).hour(_this.state.selectedDate.hours()).minute(_this.state.selectedDate.minutes())
        }, function () {
          this.closePicker();
          this.props.onChange(this.state.selectedDate.format(this.props.format));
          return this.setState({
            inputValue: this.state.selectedDate.format(this.state.inputFormat)
          });
        });
      }
    };

    this.setSelectedHour = function (e) {
      _this.setIsValid(true);
      return _this.setState({
        selectedDate: _this.state.selectedDate.clone().hour(parseInt(e.target.innerHTML)).minute(_this.state.selectedDate.minutes())
      }, function () {
        this.closePicker();
        this.props.onChange(this.state.selectedDate.format(this.props.format));
        return this.setState({
          inputValue: this.state.selectedDate.format(this.state.inputFormat)
        });
      });
    };

    this.setSelectedMinute = function (e) {
      _this.setIsValid(true);
      return _this.setState({
        selectedDate: _this.state.selectedDate.clone().hour(_this.state.selectedDate.hours()).minute(parseInt(e.target.innerHTML))
      }, function () {
        this.closePicker();
        this.props.onChange(this.state.selectedDate.format(this.props.format));
        return this.setState({
          inputValue: this.state.selectedDate.format(this.state.inputFormat)
        });
      });
    };

    this.setViewMonth = function (month) {
      return _this.setState({
        viewDate: _this.state.viewDate.clone().month(month)
      });
    };

    this.setViewYear = function (year) {
      return _this.setState({
        viewDate: _this.state.viewDate.clone().year(year)
      });
    };

    this.addMinute = function () {
      return _this.setState({
        selectedDate: _this.state.selectedDate.clone().add(1, "minutes")
      }, function () {
        this.props.onChange(this.state.selectedDate.format(this.props.format));
        return this.setState({
          inputValue: this.state.selectedDate.format(this.resolvePropsInputFormat())
        });
      });
    };

    this.addHour = function () {
      return _this.setState({
        selectedDate: _this.state.selectedDate.clone().add(1, "hours")
      }, function () {
        this.props.onChange(this.state.selectedDate.format(this.props.format));
        return this.setState({
          inputValue: this.state.selectedDate.format(this.resolvePropsInputFormat())
        });
      });
    };

    this.addMonth = function () {
      return _this.setState({
        viewDate: _this.state.viewDate.add(1, "months")
      });
    };

    this.addYear = function () {
      return _this.setState({
        viewDate: _this.state.viewDate.add(1, "years")
      });
    };

    this.addDecade = function () {
      return _this.setState({
        viewDate: _this.state.viewDate.add(10, "years")
      });
    };

    this.subtractMinute = function () {
      return _this.setState({
        selectedDate: _this.state.selectedDate.clone().subtract(1, "minutes")
      }, function () {
        _this.props.onChange(_this.state.selectedDate.format(_this.props.format));
        return _this.setState({
          inputValue: _this.state.selectedDate.format(_this.resolvePropsInputFormat())
        });
      });
    };

    this.subtractHour = function () {
      return _this.setState({
        selectedDate: _this.state.selectedDate.clone().subtract(1, "hours")
      }, function () {
        _this.props.onChange(_this.state.selectedDate.format(_this.props.format));
        return _this.setState({
          inputValue: _this.state.selectedDate.format(_this.resolvePropsInputFormat())
        });
      });
    };

    this.subtractMonth = function () {
      return _this.setState({
        viewDate: _this.state.viewDate.subtract(1, "months")
      });
    };

    this.subtractYear = function () {
      return _this.setState({
        viewDate: _this.state.viewDate.subtract(1, "years")
      });
    };

    this.subtractDecade = function () {
      return _this.setState({
        viewDate: _this.state.viewDate.subtract(10, "years")
      });
    };

    this.togglePeriod = function () {
      if (_this.state.selectedDate.hour() > 12) {
        return _this.onChange(_this.state.selectedDate.clone().subtract(12, "hours").format(_this.state.inputFormat));
      } else {
        return _this.onChange(_this.state.selectedDate.clone().add(12, "hours").format(_this.state.inputFormat));
      }
    };

    this.togglePicker = function () {
      return _this.setState({
        showDatePicker: !_this.state.showDatePicker,
        showTimePicker: !_this.state.showTimePicker
      });
    };

    this.setToday = function () {
      var today = (0, _moment2["default"])();
      _this.setIsValid(true);
      return _this.setState({
        selectedDate: today
      }, function () {
        this.closePicker();
        this.props.onChange(today);
        console.log(this.state.selectedDate);
        return this.setState({
          inputValue: this.state.selectedDate.format(this.resolvePropsInputFormat())
        });
      });
    };

    this.calculatePosition = function (options) {
      var classes = undefined,
          gBCR = undefined,
          offset = undefined,
          placePosition = undefined,
          scrollTop = undefined,
          styles = undefined,
          widgetOffsetHeight = undefined,
          clientHeight = undefined,
          height = undefined;

      classes = {};
      if (options) {
        classes["months"] = options.monthsDisplayed;
        classes["years"] = options.yearsDisplayed;
        classes["days"] = options.daysDisplayed;
        classes["time"] = options.timeDisplayed;
      }
      gBCR = _this.refs.dtpbutton.getBoundingClientRect();

      offset = {
        top: gBCR.top + window.pageYOffset - document.documentElement.clientTop,
        left: 0
      };
      offset.top = offset.top + _this.refs.datetimepicker.offsetHeight;
      //Support for both old version of react and new version (v1.4.2) of react
      //The new version of react return the child refs as a component rather than a DomNode
      widgetOffsetHeight = _this.refs.widget.offsetHeight || _reactDom2["default"].findDOMNode(_this.refs.widget).offsetHeight;
      clientHeight = _this.refs.widget.clientHeight || _reactDom2["default"].findDOMNode(_this.refs.widget).clientHeight;
      height = _this.refs.widget.height || _reactDom2["default"].findDOMNode(_this.refs.widget).height;

      scrollTop = window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
      placePosition = _this.props.direction === "up" ? "top" : _this.props.direction === "bottom" ? "bottom" : _this.props.direction === "auto" ? offset.top + widgetOffsetHeight > window.offsetHeight + scrollTop && widgetOffsetHeight + _this.refs.datetimepicker.offsetHeight > offset.top ? "top" : "bottom" : void 0;
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
      return _this.setState({
        widgetStyle: styles,
        widgetClasses: classes
      });
    };

    this.onClick = function () {
      var displayOptions = {};

      if (_this.state.showPicker) {
        return _this.closePicker();
      } else {
        _this.setState({
          showPicker: true
        });
        displayOptions.yearsDisplayed = _this.props.mode === 'year';
        displayOptions.monthsDisplayed = _this.props.mode === 'month';
        displayOptions.daysDisplayed = _this.props.mode === 'date';
        displayOptions.timeDisplayed = _this.props.mode === 'time';

        _this.calculatePosition(displayOptions);
      }
    };

    this.closePicker = function () {
      var style = _extends({}, _this.state.widgetStyle);
      style.left = -9999;
      style.display = "block";
      return _this.setState({
        showPicker: false,
        widgetStyle: style
      });
    };

    this.size = function () {
      switch (_this.props.size) {
        case _ConstantsJs2["default"].SIZE_SMALL:
          return "form-group-sm";
        case _ConstantsJs2["default"].SIZE_LARGE:
          return "form-group-lg";
      }

      return "";
    };

    this.renderOverlay = function () {
      var styles = {
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: "" + _this.props.zIndex
      };
      if (_this.state.showPicker) {
        return _react2["default"].createElement("div", { className: "bootstrap-datetimepicker-overlay", onClick: _this.closePicker, style: styles });
      } else {
        return _react2["default"].createElement("span", null);
      }
    };
  }

  _createClass(DateTimeField, [{
    key: "formatValueForEvent",
    value: function formatValueForEvent(eventName, event) {
      var value = event.target == null ? event : event.target.value;

      this.setIsValid(this.checkIsValid(value));
      if ((0, _moment2["default"])(value, this.state.inputFormat, true).isValid()) {
        this.setState({
          selectedDate: (0, _moment2["default"])(value, this.state.inputFormat, true),
          viewDate: (0, _moment2["default"])(value, this.state.inputFormat, true).startOf("month")
        });
      }

      return this.setState({
        inputValue: value
      }, function () {
        return this.props[eventName]((0, _moment2["default"])(this.state.inputValue, this.state.inputFormat, true).format(this.props.format), value);
      });
    }
  }, {
    key: "render",
    value: function render() {
      return _react2["default"].createElement(
        "div",
        { className: "bootstrap-datetimepicker-wrap" },
        this.renderOverlay(),
        _react2["default"].createElement(_DateTimePickerJs2["default"], {
          addDecade: this.addDecade,
          addHour: this.addHour,
          addMinute: this.addMinute,
          addMonth: this.addMonth,
          addYear: this.addYear,
          daysOfWeekDisabled: this.props.daysOfWeekDisabled,
          maxDate: this.props.maxDate,
          minDate: this.props.minDate,
          mode: this.props.mode,
          ref: "widget",
          selectedDate: this.state.selectedDate,
          setSelectedMonth: this.setSelectedMonth,
          setSelectedDate: this.setSelectedDate,
          setSelectedHour: this.setSelectedHour,
          setSelectedMinute: this.setSelectedMinute,
          setViewMonth: this.setViewMonth,
          setViewYear: this.setViewYear,
          setToday: this.setToday,
          showDatePicker: this.state.showDatePicker,
          showTimePicker: this.state.showTimePicker,
          showToday: this.props.showToday,
          subtractDecade: this.subtractDecade,
          subtractHour: this.subtractHour,
          subtractMinute: this.subtractMinute,
          subtractMonth: this.subtractMonth,
          subtractYear: this.subtractYear,
          togglePeriod: this.togglePeriod,
          togglePicker: this.togglePicker,
          viewDate: this.state.viewDate,
          viewMode: this.props.viewMode,
          widgetClasses: this.state.widgetClasses,
          widgetStyle: this.state.widgetStyle,
          calculatePosition: this.calculatePosition
        }),
        _react2["default"].createElement(
          "div",
          { className: (0, _classnames2["default"])("input-group date " + this.size(), { "has-error": !this.state.isValid }), ref: "datetimepicker" },
          _react2["default"].createElement("input", _extends({ className: "form-control", onChange: this.onChange, onBlur: this.onBlur, type: "text", value: this.state.inputValue }, this.props.inputProps, { ref: "inputDateTime", placeholder: this.props.defaultText })),
          _react2["default"].createElement(
            "span",
            { className: "input-group-addon", onBlur: this.onBlur, onClick: this.onClick, ref: "dtpbutton" },
            _react2["default"].createElement("span", { className: (0, _classnames2["default"])("glyphicon", this.state.buttonIcon) })
          )
        )
      );
    }
  }], [{
    key: "defaultProps",
    value: {
      dateTime: (0, _moment2["default"])().format("x"),
      format: "x",
      showToday: true,
      viewMode: "days",
      daysOfWeekDisabled: [],
      size: _ConstantsJs2["default"].SIZE_MEDIUM,
      mode: _ConstantsJs2["default"].MODE_DATETIME,
      zIndex: 999,
      onChange: function onChange(x) {
        console.log(x);
      }
    },
    enumerable: true
  }, {
    key: "propTypes",
    value: {
      dateTime: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number, _react.PropTypes.instanceOf(_moment2["default"])]),
      onChange: _react.PropTypes.func,
      format: _react.PropTypes.string,
      inputProps: _react.PropTypes.object,
      inputFormat: _react.PropTypes.string,
      defaultText: _react.PropTypes.string,
      mode: _react.PropTypes.oneOf([_ConstantsJs2["default"].MODE_DATE, _ConstantsJs2["default"].MODE_MONTH, _ConstantsJs2["default"].MODE_DATETIME, _ConstantsJs2["default"].MODE_TIME]),
      minDate: _react.PropTypes.object,
      maxDate: _react.PropTypes.object,
      direction: _react.PropTypes.string,
      showToday: _react.PropTypes.bool,
      viewMode: _react.PropTypes.string,
      zIndex: _react.PropTypes.number,
      size: _react.PropTypes.oneOf([_ConstantsJs2["default"].SIZE_SMALL, _ConstantsJs2["default"].SIZE_MEDIUM, _ConstantsJs2["default"].SIZE_LARGE]),
      daysOfWeekDisabled: _react.PropTypes.arrayOf(_react.PropTypes.number),
      isValid: _react.PropTypes.bool
    },
    enumerable: true
  }]);

  return DateTimeField;
})(_react.Component);

exports["default"] = DateTimeField;
module.exports = exports["default"];