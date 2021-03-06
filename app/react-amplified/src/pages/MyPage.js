import { useState, useEffect, useCallback } from 'react';
import {Button, TextField, Form, FormLayout, Card, Stack, Collapsible, TextContainer, Layout } from '@shopify/polaris';
import LayoutFrame from "../moduls/LayoutFrame"
import { useHistory } from 'react-router-dom'
import cognitoBase from '../Cognito/cognito.js'
import { Link } from 'react-router-dom'
import axiosBase from 'axios';
const cognito = new cognitoBase()
const cognitoUser = cognito.userPool.getCurrentUser();

export default function MyPage() {
  const [nameValue, setName] = useState("");
  const [emailValue, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const handleToggle = useCallback(() => setOpen((open) => !open), []);
  const history = useHistory();

  useEffect(() => {
    setDefaultValue();
  },[])

  function buildAttributeList() {
    return [
      {
        Name: 'name',
        Value: nameValue,
      },
      // {
      //   Name: 'email',
      //   Value: emailValue,
      // }
    ]
  }

  function setDefaultValue() {
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

  async function handleSubmit(e) {
    e.preventDefault();

    if(!window.confirm("ユーザー情報を更新してもよろしいですか？")) {
      return;
    }

    await cognitoUser.updateAttributes(buildAttributeList(), function(err, result) {
    	if (err) {
    		alert(err.message || JSON.stringify(err));
    		return;
    	}
    
      cognitoUser.getSession((err, session) => {
        if (err) {
          console.log(err)
          return null
        } else {
          if (!session.isValid()) {
            console.log("session", session)
            return null
          } else {
            // console.log("jwtToken", session.idToken.jwtToken);
            // console.log("baseURL", process.env.REACT_APP_COGNITO_API_URL);
            const app = axiosBase.create({
              // baseURL: process.env.REACT_APP_PUBLIC_COGNITO_API_URL,
              baseURL: process.env.REACT_APP_COGNITO_API_URL,
              headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + session.idToken.jwtToken
              },
              responseType: 'json'
            });
            app.post('/create',{
              username: cognitoUser.username,
              email: emailValue,
              // TODO: 取得をして、ちゃんとしたものに変更する
              shop_id: "shopOrigin"
            })
            .then((value) => {
              window.alert("変更後のメールアドレスに承認リンクを送信しました。\n変更する場合、そちらのメールアドレスをクリックしてください。");
              console.dir("success",value);
            })
            .catch((err) => {
              console.log("err",err)
            });

            return session
          }
        }
      });
    });
  }

  function delete_current_user() {
    if (window.confirm("本当に削除してよろしいですか？\n\n※削除したアカウントは元に戻すことができません。")) {
      cognito.delete();
      history.go(0);
    }
  }

  return (
    <LayoutFrame>
      <div style={{margin: "50px 0", fontSize: "3em"}}>
        <h1>マイページ</h1>
      </div>
      <Form onSubmit={(e) => handleSubmit(e)}>
        <FormLayout>
          <TextField
            value={nameValue}
            onChange={value => setName(value)}
            label="Name"
            type="text"
          />
          <TextField
            value={emailValue}
            onChange={value => setEmail(value)}
            label="Email"
            type="text"
          />
          <Button size="big" submit>送信</Button>
          <Link to="/change_password">パスワードを変更したい方はこちら</Link>
        </FormLayout>
      </Form>
      <hr style={{margin: "20px 0"}}/>
      <Stack vertical>
        <Button
          onClick={handleToggle}
          ariaExpanded={open}
          ariaControls="basic-collapsible"
        >
          アカウントの削除について
        </Button>
        <Collapsible
          open={open}
          id="basic-collapsible"
          transition={{duration: '500ms', timingFunction: 'ease-in-out'}}
          expandOnPrint
        >
          <TextContainer>
            <p>
              もし、現在お使いのアカウントを削除したい場合は以下のリンクをクリックし、「はい」を選択してください。<br/>
              ※ 一度削除されたアカウントは元に戻すことはできませんのでご注意ください。
            </p>
            <br/>
            <Link to="#" onClick={e => delete_current_user(e)}>アカウントを削除します</Link>
            </TextContainer>
        </Collapsible>
      </Stack>
    </LayoutFrame>
    )
  }
