import React from 'react';
import "./App.css";
import { AppProvider } from '@shopify/polaris'
import translations from "@shopify/polaris/locales/ja.json";
import { BrowserRouter, Switch, Route,Redirect } from 'react-router-dom'
import Auth from './Auth'
import Callback from './Callback'
import Top from './Top'
import SignIn from './SignIn'
import Verification from './Verification'
import { parse } from 'query-string';

import cognitoBase from './Cognito/cognito.js'
const cognito = new cognitoBase()

class App extends React.Component{
  render(){
    console.log("user:")
    console.log(cognito.userPool.getCurrentUser())
    return (
      <AppProvider i18n={translations}>
        <BrowserRouter>
          <Switch>
              <Route exact path='/top'>
                {cognito.userPool.getCurrentUser() == null ? <Redirect to="/sign_in" /> : <Top/>  } 
              </Route>
              <Route path='/auth' component={Auth} />
              <Route path='/callback' component={Callback} />
              <Route path='/sign_in' component={SignIn} />
              <Route exact path='/verification/:email' component={Verification} />
          </Switch>
        </BrowserRouter>
      </AppProvider>
    );
  }
}

export default App;
