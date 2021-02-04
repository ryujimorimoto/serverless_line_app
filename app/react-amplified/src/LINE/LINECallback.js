import React, { useState, useEffect, useCallback } from 'react';
import axiosBase from 'axios';
import {Button, TextField, Form, FormLayout, Spinner, Toast } from '@shopify/polaris';

import LayoutFrame from "../moduls/LayoutFrame"
import CustomTextField from "../additionalAtoms/CustomTextField"
import Callback from '../moduls/Callback';

export default function LINECallback() {
  const [lineMessage, setLineMessage] = useState('');
  const handleMessageChange = useCallback((value) => setLineMessage(value), []);

  async function lineConnectTest(message){
    console.log(process.env.REACT_APP_LINE_API_URL)
    const axios = axiosBase.create({
      baseURL: process.env.REACT_APP_LINE_API_URL,
      headers: {
          'Content-Type': 'application/json',
      },
      responseType: 'json'
    })
    let messageParams = new URLSearchParams()
    messageParams.append("message", message)
    const res = await axios.post(`/sendtest?message=${message}`);
    console.log("res")
    console.log(res)
    if(res.data.exist){
      return true
    }else{
      return false
    }
  }
  
  const [sendLoading, setSendLoading] = useState(false)
  const [errorToast, setErrorToast] = useState(false)
  const toggleErrorToast = useCallback(() => setErrorToast((errorToast) => !errorToast), []);
  const showToast = errorToast ? (
    <Toast content={errorToast} error onDismiss={toggleErrorToast} />
  ) : null;
  const sendSubmitButton = sendLoading == false ?
    (<Button size="big" submit>送信</Button>) :
    (<Spinner accessibilityLabel="ローディング..." size="large" color="teal" />)
  async function handleSendSubmit(e) {
    e.preventDefault();
    console.log(lineMessage)
    if (lineMessage == "") {
      return setErrorToast("入力がありません")
    }else{
      try {
        lineConnectTest(lineMessage)
      } catch(err) {
        console.log(err);
      }
    }
  }

  return (
    <LayoutFrame>
      <Form noValidate onSubmit={handleSendSubmit} encType="application/x-www-form-urlencoded">
        <FormLayout>
          <TextField
            value={lineMessage}
            onChange={handleMessageChange}
            label="LINE通知テスト"
            type="text"
          />
          {sendSubmitButton}
          {showToast}
        </FormLayout>
      </Form>
    </LayoutFrame>
  )
}
