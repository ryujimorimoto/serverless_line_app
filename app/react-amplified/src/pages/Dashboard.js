import React, {useCallback, useRef, useState} from 'react';
import {AppProvider, Avatar, ActionList, Card, TextField, TextContainer, ContextualSaveBar, FormLayout, Modal, Frame, Layout, Loading, Navigation, Page, SkeletonBodyText, SkeletonDisplayText, SkeletonPage, Toast, TopBar} from '@shopify/polaris';
import {ArrowLeftMinor, ConversationMinor, HomeMajor, OrdersMajor} from '@shopify/polaris-icons';
import LayoutFrame from "../moduls/LayoutFrame"

export default function Dashboard() {

  
  return (
    <div style={{height: '500px'}}>
     {LayoutFrame()}
    </div>
  );
}
