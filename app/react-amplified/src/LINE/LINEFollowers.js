import React, { useState, useEffect, useCallback } from 'react';
import axiosBase from 'axios';
import {Button, TextField, Form, FormLayout, Spinner, Toast } from '@shopify/polaris';

import LayoutFrame from "../moduls/LayoutFrame"
import cognitoBase from '../Cognito/cognito.js'
const cognito = new cognitoBase()


export default function LINEFollowers() {
  const [lineFollower, setlineFollower] = useState('');

  // async function lineGetFollowers(jwtToken){
  //   const axios = axiosBase.create({
  //     baseURL: process.env.REACT_APP_PRIVATE_API_URL,
  //     headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': 'Bearer ' + jwtToken
  //       },
  //     responseType: 'json'
  //   });
  //   const res = await axios.get("/line/followers");
  //   return res.data;
  // }
  
  useEffect(()=>{

    const current_user = cognito.userPool.getCurrentUser();
    if(current_user == null){
      return window.location.href = "/top";
    }
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
    // lineGetFollowers(user_session.idToken.jwtToken);

    const axios = axiosBase.create({
      baseURL: process.env.REACT_APP_PRIVATE_API_URL,
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + user_session.idToken.jwtToken
        },
      responseType: 'json'
    });

      const res = axios.get("/line/followers").then(res => {
        let profileMarkUp = [];
        const result = res.data;
        for (let index = 0; index < result.length; index++) {
          profileMarkUp.push(
            <div key={result[index][0]} >
              <li key={result[index][1]}>お名前：{result[index][1]}</li>
              <li key={result[index][2]}>画像：<img src={result[index][2]} style={{ "width": "10%"}} alt={result[index][1]} /></li>
              <li key={result[index][3]}>ステータスメッセージ：{result[index][3]}</li>
            </div>
          );
        }
        setlineFollower(profileMarkUp)
      });

      
    
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
      <ul>
        {lineFollower}
      </ul>
    </LayoutFrame>
  )
}
