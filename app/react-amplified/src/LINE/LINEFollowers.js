import React, { useState, useEffect, useCallback } from 'react';
import axiosBase from 'axios';
import {Button, TextField, Form, FormLayout, Spinner, Toast } from '@shopify/polaris';

import LayoutFrame from "../moduls/LayoutFrame"
import cognitoBase from '../Cognito/cognito.js'
const cognito = new cognitoBase()


export default function LINEFollowers() {
  const [lineFollowers, setLineFollowers] = useState('cc');
  // const handleLineFollwersChange = useCallback((value) => setLineFollowers(value), []);

  async function lineGetFollowers(jwtToken){
    const axios = axiosBase.create({
      baseURL: process.env.REACT_APP_PRIVATE_API_URL,
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + jwtToken
        },
      responseType: 'json'
    });
    const res = await axios.get("/line/followers");
    await setLineFollowers(res.data);
    return;
  }
  
  useEffect(()=>{
    const current_user = cognito.userPool.getCurrentUser();
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
    const follower_ids = lineGetFollowers(user_session.idToken.jwtToken);
  },[])
  // const [sendLoading, setSendLoading] = useState(false)
  // const [errorToast, setErrorToast] = useState(false)
  // const toggleErrorToast = useCallback(() => setErrorToast((errorToast) => !errorToast), []);
  // const showToast = errorToast ? (
  //   <Toast content={errorToast} error onDismiss={toggleErrorToast} />
  // ) : null;
  // const sendSubmitButton = sendLoading == false ?
  //   (<Button size="big" submit>送信</Button>) :
  //   (<Spinner accessibilityLabel="ローディング..." size="large" color="teal" />)
  

  return (
    <LayoutFrame>
      {lineFollowers}
    </LayoutFrame>
  )
}
