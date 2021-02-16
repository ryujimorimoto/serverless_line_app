import React from 'react';
import "../App.css";
import { AppProvider } from '@shopify/polaris'
import translations from "@shopify/polaris/locales/ja.json";
import { BrowserRouter, Switch, Route,Redirect } from 'react-router-dom'
import Auth from '../moduls/Auth'
import Callback from '../moduls/Callback'
import LINECallback from '../LINE/LINECallback'
import LINEFollowers from '../LINE/LINEFollowers'
import Top from './Top'
import SignIn from './SignIn'
import Verification from './Verification'
import ShopDomain from './ShopDomain'
import Dashboard from './Dashboard'

import { parse } from 'query-string';

import cognitoBase from '../Cognito/cognito.js'
const cognito = new cognitoBase()
    const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
    class App extends React.Component{
      
  render(){
    console.log("user:")
    console.log(cognito.userPool.getCurrentUser());
    return (
      <AppProvider i18n={translations}>
        <BrowserRouter>
          <Switch>
            <Route path='/auth' component={Auth} />
            <Route path='/callback' component={Callback} />
            <Route path='/sign_in' component={SignIn} />
            <Route exact path='/verification/:email' component={Verification} />
            <Route path='/shop_domain' component={ShopDomain} />
          { cognito.userPool.getCurrentUser() == null || cognito.userPool.getCurrentUser().getSession(function(error,session){return session}) == null ? 
            <Redirect to="/sign_in" />
            :
            <>
              <Route exact path='/top' component={Dashboard} />
              <Route path='/line_api/callback' component={LINECallback} />
              <Route path='/followers' component={LINEFollowers} />
            </>
          }
            
          </Switch>
        </BrowserRouter>
      </AppProvider>
    );
  }
}

export default App;
