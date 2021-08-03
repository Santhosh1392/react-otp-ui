# react-otp-ui
One-time password input component for React.

## How to Install

Make sure you have [Node.js](http://nodejs.org/) and NPM installed.

```sh
npm install react-otp-ui
```

Or

```sh
yarn add react-otp-ui
```

## How to Use

```sh
import React from 'react'
import OtpForm from 'react-otp-ui'

const OTPDemo = () => {
  const handleOnChange = (data) => {
    console.log('data', data)
    
    /* data object like this {digit: '1', digit2: '2', digit3: '3', digit4: '4', otpValue: '1234'} */
  }

  return (
    <OtpForm
      onChange={handleOnChange}
    />
  )
}
```

## Demo

![Datepicker Demo](https://github.com/Santhosh1392/react-datepicker-ui/blob/main/demo/demo.gif)

Check out [Online Demo](https://korimi.in/projects) here.

```sh
import React from 'react'
import OtpForm from 'react-otp-ui'

const OTPDemoAdvanced = () => {
  const handleOnChange = (data) => {
    console.log('data', data)
  }

  return (
    <OtpForm
      onChange={handleOnChange}
      numberOfInputs={6}
      showSeparator
      separtor=":"
      secureInput
    />
  )
}
```

## Available Props

| Prop Name     | Type     | Default Value | Description                                             |
| ------------- | -------- | ------------- | ------------------------------------------------------- |
| className     | String   | ''            | className for input to add custom styles                |
| disabled      | Boolean  | false         | It will disable the inputs to enter values              |
| numberOfInputs| Number   | 4             | Length of OTP value to capture from user                |
| onChange      | Function | null          | Callback function to get the entered OTP value          |
| secureInput   | Boolean  | false         | To render the inputs like password fields               | 
| separator     | String   | -             | Text to show in separator between inputs                |
| showSeparator | Boolean  | false         | Flag to show separator between inputs                   |
