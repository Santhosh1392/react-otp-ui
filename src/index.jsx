import React, { useEffect, useReducer, useState } from "react";
import "./styles.scss";

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

export const OtpInput = ({
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
    <div className='react-otp-input-container'>
      <input
        type={!secureInput ? "text" : "password"}
        onChange={(e) => onChange(e, inputIndex)}
        id={data.id}
        maxLength={1}
        value={data.value}
        key={data.id}
        disabled={disabled}
        onKeyDown={handleOnKeyDown}
        className={`${className} react-otp-ui-input`}
        onFocus={() => onFocus(inputIndex)}
      />
      {showSeparator && !isLastInput && (
        <span className="input-separator">{separator && separator[0]}</span>
      )}
    </div>
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
  const [inputsArray, setInputsArray] = useReducer(
    otpFormReducer,
    getInitialState(numberOfInputs)
  );
  const [focusId, setFocusId] = useState("");
  const [currentFocusIndex, setCurrentFocusIndex] = useState(0);

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

  useEffect(() => {
    const el = document.getElementById(focusId);
    if (el) el.focus();
  }, [focusId]);

  useEffect(() => {
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

  useEffect(() => {
    const inputs = getInitialState(numberOfInputs)
    setInputsArray({
      type: SET_ALL_VALUES,
      data: inputs
    })
  }, [numberOfInputs])

  return (
    <div className="react-otp-ui-input-container">
      {inputsArray.map((input, index) => (
        <OtpInput
          secureInput={secureInput}
          onChange={handleOnChange}
          data={input}
          inputIndex={index}
          className={className}
          disabled={disabled}
          key={input.id}
          showSeparator={showSeparator}
          separator={separator}
          isLastInput={index === numberOfInputs - 1}
          changeFocusPosition={changeFocusPosition}
          onFocus={handleOnFocus}
        />
      ))}
    </div>
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

export default OtpForm;
