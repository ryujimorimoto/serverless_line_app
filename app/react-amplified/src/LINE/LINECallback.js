import React from 'react';
import LineClient from "./LINEconfigure";

export default function LINECallback() {

  const test_push = (userId) => {
    LineClient.pushText(userId, 'Hello World').then(() => {
      console.log('pushed');
    });
  }
  
  return (
    <div className="Callback">callback</div>
  )
}
