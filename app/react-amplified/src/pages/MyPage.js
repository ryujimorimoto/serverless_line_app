import React, { useState, useEffect, useCallback } from 'react';
import axiosBase from 'axios';
import {Button, TextField, Form, FormLayout, Spinner, Toast } from '@shopify/polaris';

import LayoutFrame from "../moduls/LayoutFrame"
import cognitoBase from '../Cognito/cognito.js'
const cognito = new cognitoBase()

export default function MyPage() {
  return (
    <div style={{height: '500px'}}>
     <LayoutFrame>
       <p>マイページ</p>
     </LayoutFrame>
    </div>
  )
}
