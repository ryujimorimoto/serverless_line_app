import { useState, useEffect, useCallback } from 'react';
import {Button, TextField, Form, FormLayout, Spinner, Toast } from '@shopify/polaris';

import LayoutFrame from "../moduls/LayoutFrame"
import cognitoBase from '../Cognito/cognito.js'
import { Link } from 'react-router-dom'

const cognito = new cognitoBase()

function handleSubmit(e, oldPasswordValue, newPasswordValue, newPasswordConfirmValue, setOldPassword, setNewPassword, setNewPasswordConfirm) {
  e.preventDefault()

  if (oldPasswordValue === "") {
    window.alert("旧パスワードが空になっています。\n\n入力してください。")
    return
  }

  if (newPasswordValue === "") {
    window.alert("新パスワードが空になっています。\n\n入力してください。")
    return
  }

  if (newPasswordConfirmValue === "") {
    window.alert("確認用パスワードが空になっています。\n\n入力してください。")
    return
  }

  if (newPasswordValue !== newPasswordConfirmValue) {
    window.alert("新しいパスワードと確認用のパスワードが異なります")
    return
  }

  if (window.confirm("パスワードを変更しますか？")) {
    cognito.changePassword(oldPasswordValue, newPasswordValue).then(
      (resolve)=>{
        window.alert("変更に成功しました。");
      }
    ).catch(
      (reject)=>{
        window.alert(reject.message);
        // switch (reject.code) {
        //   case "InvalidParameterException":
        //     window.alert("旧パスワードが異なります。");
        //     break;
        //   case "LimitExceededException":
        //     window.alert("制限回数に達しました。\n\n時間をおいてから、再度お試しください。");
        //     break;
        //   default:
        //     window.alert(reject);
        //     break;
        // }
    })
    setOldPassword("")
    setNewPassword("")
    setNewPasswordConfirm("")
  }
}

export default function ChangePassword() {
  const [oldPasswordValue, setOldPassword] = useState("");
  const [newPasswordValue, setNewPassword] = useState("");
  const [newPasswordConfirmValue, setNewPasswordConfirm] = useState("");

  return (
    <LayoutFrame>
      <div style={{margin: "50px 0", fontSize: "3em"}}>
        <h1>パスワード変更</h1>
      </div>
      <Form onSubmit={(e) => handleSubmit(e, oldPasswordValue, newPasswordValue, newPasswordConfirmValue, setOldPassword, setNewPassword, setNewPasswordConfirm)}>
        <FormLayout>
          <TextField
            value={oldPasswordValue}
            onChange={(value) => setOldPassword(value)}
            label="Enter your old password."
            type="password"
          />
          
          <TextField
            value={newPasswordValue}
            onChange={(value) => setNewPassword(value)}
            label="Enter your new password（半角英数字記号（大文字・小文字・数字・記号）を各一つずつ以上含み、合計8文字以上になるように入力してください）"
            type="password"
          />
          <TextField
            value={newPasswordConfirmValue}
            onChange={(value) => setNewPasswordConfirm(value)}
            label="Enter your new password again."
            type="password"
          />
          <Button size="big" submit>送信</Button>
        </FormLayout>
      </Form>
      <div>
        <Link to="/my_page">ユーザー情報を変更します</Link>
      </div>
    </LayoutFrame>
  )
}
