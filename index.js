

function ___$insertStyle(css) {
  if (!css) {
    return;
  }
  if (typeof window === 'undefined') {
    return;
  }

  var style = document.createElement('style');

  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  document.head.appendChild(style);
  return css;
}

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

___$insertStyle(".react-otp-ui-input-container {\n  display: flex;\n  align-items: center;\n  max-width: 100%;\n}\n.react-otp-ui-input-container .react-otp-ui-input {\n  width: 50px;\n  height: 50px;\n  margin-right: 10px;\n  outline: none;\n  border-radius: 3px;\n  border: 1px solid rgba(0, 0, 0, 0.3);\n  text-align: center;\n  font-size: 24px;\n  font-weight: bold;\n}\n.react-otp-ui-input-container .react-otp-ui-input:last-child input {\n  margin-right: 0;\n}\n.react-otp-ui-input-container .input-separator {\n  display: inline-block;\n  margin-right: 10px;\n  font-size: 24px;\n  font-weight: bold;\n}");

const MOVE_LEFT = "moveleft";
const MOVE_RIGHT = "move_right";
const SET_VALUE = "SET_VALUE";
const UPDATE_VALUE = "UPDATE_VALUE";
const SET_ALL_VALUES = 'SET_ALL_VALUES';
const getRandomID = () => `_${Math.random().toString(36).substr(2, 9)}`;

const getInitialState = (numberOfInputs) => {
  const otpInputsData = [];
  for (let i = 1; i <= numberOfInputs; i += 1) {
    otpInputsData.push({
      id: getRandomID(),
      value: "",
    });
  }
  return otpInputsData;
};

const otpFormReducer = (state, action) => {
  const { type, value, index, isBackspace, data } = action;
  const newState = [...state];
  if (type === SET_VALUE) {
    if (isBackspace) {
      newState[index].value = "";
    } else if (newState[index]) {
      newState[index].value = value;
    }
  } else if (type === SET_ALL_VALUES) {
    return data
  }
  return newState;
};

const OtpInput = ({
  className,
  changeFocusPosition,
  disabled,
  data,
  isLastInput,
  inputIndex,
  onChange,
  onFocus,
  secureInput,
  separator,
  showSeparator,
}) => {
  const handleOnKeyDown = (e) => {
    const { key, keyCode } = e;
    if (key === "Backspace") {
      e.preventDefault();
      changeFocusPosition(MOVE_LEFT, true);
    } else if (key === "ArrowLeft") {
      e.preventDefault();
      changeFocusPosition(MOVE_LEFT);
    } else if (key === "ArrowRight") {
      e.preventDefault();
      changeFocusPosition(MOVE_RIGHT);
    } else if (key === "Spacebar" || key === "Space") {
      e.preventDefault();
    } else if (keyCode >= 48 && keyCode <= 57) {
      changeFocusPosition(UPDATE_VALUE, false, e.key);
    } else if (key === "Delete") {
      e.preventDefault();
    }
  };

  return (
    React__default['default'].createElement('div', {className: "react-otp-input-container"}, [
      React__default['default'].createElement('input', {
        type: secureInput ? "text" : "password",
        onChange: (e) => onChange(e, inputIndex),
        id: data.id,
        maxLength: 1,
        value: data.value,
        key: data.id,
        disabled: disabled,
        onKeyDown: handleOnKeyDown,
        className: `${className} react-otp-ui-input`,
        onFocus: () => onFocus(inputIndex)}
      ),
      showSeparator && !isLastInput && (
        React__default['default'].createElement('span', {className: "input-separator"}, [separator && separator[0]])
      )
    ])
  );
};

const OtpForm = ({
  className,
  disabled,
  numberOfInputs,
  onChange,
  secureInput,
  separator,
  showSeparator,
}) => {
  const [inputsArray, setInputsArray] = React.useReducer(
    otpFormReducer,
    getInitialState(numberOfInputs)
  );
  const [focusId, setFocusId] = React.useState("");
  const [currentFocusIndex, setCurrentFocusIndex] = React.useState(0);

  const checkIsNextOrPrevPositionValid = (curPos, prevOrNext) => {
    // prevOrNext - true - Previous position
    // prevOrNext - false - Nextposition

    if (!prevOrNext) {
      return curPos + 1 <= numberOfInputs;
    } else {
      return curPos - 1 >= 0;
    }
  };

  const handleOnChange = (e, inputIndex) => {
    const { value } = e.target;
    const updatedValue = value.replace(/[^0-9.]/g, "");
    const isNextPositionValid = checkIsNextOrPrevPositionValid(inputIndex);
    if (isNextPositionValid) {
      setInputsArray({
        type: SET_VALUE,
        value: updatedValue,
        index: inputIndex,
      });
    }
    if (inputIndex !== numberOfInputs - 1) {
      setCurrentFocusIndex(inputIndex + 1);
      setFocusId(inputsArray[inputIndex + 1].id);
    }
  };

  const changeFocusPosition = (dir, isBackspace, value) => {
    if (isBackspace && currentFocusIndex >= 0) {
      setInputsArray({
        type: SET_VALUE,
        index: currentFocusIndex,
        isBackspace,
      });
      if (currentFocusIndex !== 0) {
        setCurrentFocusIndex(currentFocusIndex - 1);
        setFocusId(inputsArray[currentFocusIndex - 1].id);
      }
    } else if (dir === MOVE_RIGHT && currentFocusIndex !== numberOfInputs - 1) {
      setCurrentFocusIndex(currentFocusIndex + 1);
      setFocusId(inputsArray[currentFocusIndex + 1].id);
    } else if (dir === MOVE_LEFT && currentFocusIndex !== 0) {
      setCurrentFocusIndex(currentFocusIndex - 1);
      setFocusId(inputsArray[currentFocusIndex - 1].id);
    } else if (dir === UPDATE_VALUE) {
      setInputsArray({
        type: SET_VALUE,
        index: currentFocusIndex,
        value,
      });
      if (currentFocusIndex !== numberOfInputs - 1) {
        setCurrentFocusIndex(currentFocusIndex + 1);
        setFocusId(inputsArray[currentFocusIndex + 1].id);
      }
    }
  };

  const handleOnFocus = (index) => {
    setCurrentFocusIndex(index);
  };

  React.useEffect(() => {
    const el = document.getElementById(focusId);
    if (el) el.focus();
  }, [focusId]);

  React.useEffect(() => {
    const returnState = {};
    let otpValue = "";
    for (let i = 0; i < inputsArray.length; i += 1) {
      returnState[`digit${i + 1}`] = inputsArray[i].value;
      otpValue += inputsArray[i].value;
    }
    returnState.otpValue = otpValue;
    if (onChange instanceof Function) {
      onChange(returnState);
    }
  }, [inputsArray]);

  React.useEffect(() => {
    const inputs = getInitialState(numberOfInputs);
    setInputsArray({
      type: SET_ALL_VALUES,
      data: inputs
    });
  }, [numberOfInputs]);

  return (
    React__default['default'].createElement('div', {className: "react-otp-ui-input-container"}, [
      inputsArray.map((input, index) => (
        OtpInput({
          secureInput: secureInput,
          onChange: handleOnChange,
          data: input,
          inputIndex: index,
          className: className,
          disabled: disabled,
          key: input.id,
          showSeparator: showSeparator,
          separator: separator,
          isLastInput: index === numberOfInputs - 1,
          changeFocusPosition: changeFocusPosition,
          onFocus: handleOnFocus}
        )
      ))
    ])
  );
};

OtpForm.defaultProps = {
  className: "",
  disabled: false,
  handleOnChange: null,
  numberOfInputs: 4,
  secureInput: true,
  separator: "-",
  showSeparator: false,
};

exports.OtpInput = OtpInput;
exports['default'] = OtpForm;
//# sourceMappingURL=index.js.map
