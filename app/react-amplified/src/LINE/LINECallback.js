import React from 'react';
import LineClient from "./LINEconfigure";
import axiosBase from 'axios';

export default class LINECallback extends React.Component {

  async lineConnect(query){
    console.log(query)
    const axios = axiosBase.create({
      baseURL: process.env.REACT_APP_PRIVATE_API_URL,
      headers: {
          'Content-Type': 'application/json',
      },
      responseType: 'json'
    })
    console.log("axios")
    console.log(axios)

    const res = await axios.post('/line_api')
    console.log("res")
    console.log(res)
    if(res.data.exist){
      return true
    }else{
      return false
    }
  }
  async componentDidMount() {
    const token = await this.lineConnect("query")
  }
  render(){
    return (
    <div className="Callback">callback</div>
  )
}}
