import { useState, useEffect, useCallback } from 'react';
import {Button, TextField, Form, FormLayout, Spinner, Toast } from '@shopify/polaris';

import LayoutFrame from "../moduls/LayoutFrame"
import cognitoBase from '../Cognito/cognito.js'
import { Link } from 'react-router-dom'

const cognito = new cognitoBase()
const cognitoUser = cognito.userPool.getCurrentUser();

function buildAttributeList(nameValue, emailValue) {
  return [
    {
      Name: 'name',
      Value: nameValue,
    },
    {
      Name: 'email',
      Value: emailValue,
    }
  ]
}

function handleSubmit(e, nameValue, emailValue) {
  e.preventDefault()
  const attributeList = buildAttributeList(nameValue, emailValue)

  // todo: このupdateAttributessはcognito.jsへうつす
  cognitoUser.updateAttributes(attributeList, function(err, result) {
	if (err) {
		alert(err.message || JSON.stringify(err));
		return;
	}
	console.log('call result: ' + result);
});
}

function setDefaultValue(setName, setEmail) {
  // todo: このgetUserAttributesはcognito.jsへうつす？（でもstate使ってる）
  cognitoUser.getSession(function(err, session) {
    if (err) {
        console.log(err);
    } else {
      cognitoUser.getUserAttributes(function(err, result) {
        if (err) {
          console.log(err.message || JSON.stringify(err));
        } else {
          for (let i = 0; i < result.length; i++) {
            if (result[i].getName() === "name") {
              setName(result[i].getValue());
            }
            if (result[i].getName() === "email") {
              setEmail(result[i].getValue());
            }
          }
        }
        return null;
      })
    }
  });
}

export default function MyPage() {
  const [nameValue, setName] = useState("");
  const [emailValue, setEmail] = useState("");
  const [oldPasswordValue, setOldPassword] = useState("");
  const [newPasswordValue, setNewPassword] = useState("");
  const [newPasswordConfirmValue, setNewPasswordConfirm] = useState("");
  useEffect(() => {
    setDefaultValue(setName, setEmail)
  },[])
  return (
    <LayoutFrame>
      <div style={{margin: "50px 0", fontSize: "3em"}}>
        <h1>マイページ</h1>
      </div>
      <Form onSubmit={(e) => handleSubmit(e, nameValue, emailValue)}>
        <FormLayout>
          <TextField
            value={nameValue}
            onChange={(value) => setName(value)}
            label="Name"
            type="text"
          />
          <TextField
            value={emailValue}
            onChange={(value) => setEmail(value)}
            label="Email"
            type="text"
          />
          <Button size="big" submit>送信</Button>
        </FormLayout>
      </Form>
      <div>
        <Link to="/change_password">パスワードを変更します</Link>
      </div>
    </LayoutFrame>
  )
}
