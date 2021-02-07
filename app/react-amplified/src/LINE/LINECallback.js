import React, { useState, useEffect, useCallback } from 'react';
import axiosBase from 'axios';
import {Button, TextField, Form, FormLayout, Spinner, Toast } from '@shopify/polaris';

import LayoutFrame from "../moduls/LayoutFrame"
import cognitoBase from '../Cognito/cognito.js'
const cognito = new cognitoBase()


export default function LINECallback() {
  const [lineMessage, setLineMessage] = useState('');
  const handleMessageChange = useCallback((value) => setLineMessage(value), []);

  async function lineConnectTest(message){
    const current_user = await cognito.userPool.getCurrentUser();
    const user_session = current_user.getSession((err, session) => {
      if (err) {
          console.log(err)
          return null
        } else {
        if (!session.isValid()) {
          console.log(session)
          return null
        } else {
          return session
        }
      }
  });
  const jwtToken = user_session.idToken.jwtToken;
    const axios = axiosBase.create({
      baseURL: process.env.REACT_APP_PRIVATE_API_URL,
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + jwtToken
        },
      responseType: 'json'
    })
    const res = await axios.post(`/test?message=${message}`);
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
    setSendLoading(true)
    console.log(lineMessage)
    if (lineMessage == "") {
      setSendLoading(false)
      return setErrorToast("入力がありません")
    }else{
      try {
        lineConnectTest(lineMessage)
      } catch(err) {
        console.log(err);
      }
    }
    setSendLoading(false)
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
