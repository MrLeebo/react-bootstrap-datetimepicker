import React from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";

jest.dontMock("moment");
jest.dontMock("../DateTimeField.js");

describe("DateTimeField", function() {
  const moment = require("moment");
  const DateTimeField = require("../DateTimeField.js");
  const happyDate = moment("1990-06-05 07:30");
  let createParent, TestParent;


  describe("By default", function() {

   it("shows the right date for a given dateTime and inputFormat", function() {
     const component = TestUtils.renderIntoDocument(<DateTimeField dateTime={happyDate.format("x")} />);
     const input = TestUtils.findRenderedDOMComponentWithTag(component, "input");
     expect(input.value).toBe("06/05/90 7:30 AM");
    });

    it("allows a custom zIndex to be applied to overlay", function() {
      const component = TestUtils.renderIntoDocument(<DateTimeField zIndex={1234} />);
	  const input = TestUtils.findRenderedDOMComponentWithClass(component, "input-group-addon");
	  TestUtils.Simulate.click(input);
      const overlay = TestUtils.findRenderedDOMComponentWithClass(component, "bootstrap-datetimepicker-overlay");
      expect(ReactDOM.findDOMNode(overlay).style.zIndex).toBe('1234');
     });

  });

  describe("When changing props", function() {

    beforeEach(() => {
      TestParent = React.createFactory(React.createClass({
        getInitialState() {
          return {
            dateTime: happyDate.format("x"),
            ...this.props
          };
        },

        render() {
          return <DateTimeField {...this.state} />;
        }
      }));
      createParent = (initalState) => TestUtils.renderIntoDocument(TestParent(initalState)); // eslint-disable-line
    });

    it("changes the displayed date when dateTime changes", function() {
      const Parent = createParent();
      const input = TestUtils.findRenderedDOMComponentWithTag(Parent, "input");
      expect(input.value).toBe("06/05/90 7:30 AM");
      Parent.setState({dateTime: moment("1981-06-04 05:45").format("x")});
      expect(input.value).toBe("06/04/81 5:45 AM");
     });

    it("changes the displayed format when inputFormat changes", function() {
      const Parent = createParent();
      const input = TestUtils.findRenderedDOMComponentWithTag(Parent, "input");
      expect(input.value).toBe("06/05/90 7:30 AM");
      Parent.setState({inputFormat: "x"});
      expect(input.value).toBe(happyDate.format("x"));
     });

    it("doesn't change the defaultText if dateTime didn't change", function() {
      const Parent = createParent({defaultText: "Pick a date"});
      const input = TestUtils.findRenderedDOMComponentWithTag(Parent, "input");
      expect(input.getAttribute('placeholder')).toBe("Pick a date");
      Parent.setState({});
      expect(input.getAttribute('placeholder')).toBe("Pick a date");
    });

    it('should call the onChange callback', function () {
      const onChangeMock = jest.genMockFunction();
      const Parent = createParent({onChange: onChangeMock});
      const input = TestUtils.findRenderedDOMComponentWithTag(Parent, "input");
      input.value = "2:13 AM";
      TestUtils.Simulate.change(input);

      expect(onChangeMock.mock.calls.length).toBe(1);
    })

    it('should call the onBlur callback', function () {
      const onBlurMock = jest.genMockFunction();
      const Parent = createParent({onBlur: onBlurMock});
      const input = TestUtils.findRenderedDOMComponentWithTag(Parent, "input");
      input.value = "2:13 AM";
      TestUtils.Simulate.change(input);
      TestUtils.Simulate.blur(input);

      expect(onBlurMock.mock.calls.length).toBe(1);
    })

  });

});
