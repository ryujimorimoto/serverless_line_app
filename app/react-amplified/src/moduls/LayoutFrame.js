import React, {useCallback, useState, useRef} from 'react';
import {AppProvider, TextStyle, ContextualSaveBar, Frame, Layout, Page, SettingToggle, TopBar} from '@shopify/polaris';
import CustomProviderTheme from "../additionalAtoms/CustomProviderTheme"
import SideBar from "../moduls/SideBar"
import { PromoteMinor } from '@shopify/polaris-icons';
import cognitoBase from '../Cognito/cognito.js'
const cognito = new cognitoBase()

export default function LayoutFrame(props) {
  const skipToContentRef = useRef(null);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const defaultState = useRef({
    emailFieldValue: "dharma@jadedpixel.com",
  });
  const handlerLogout = useCallback(() => {
    cognito.logout();
  }, [])
  const userMenuActions = [
    {
      items: [
        {
          content: 'ログアウト', 
          icon: PromoteMinor, 
          onAction: handlerLogout,
          destructive: true,
        }
      ],
    },
  ];
  const [userMenuActive, setUserMenuActive] = useState(false);
  const [storeName, setStoreName] = useState(
    defaultState.current.nameFieldValue,
  );
  const toggleUserMenuActive = useCallback(
    () => setUserMenuActive((userMenuActive) => !userMenuActive),
    []
  );
  const UserMenu = (
<TopBar.UserMenu
        actions={userMenuActions}
        name="Admin"
        detail={storeName}
        initials="A"
        open={userMenuActive}
        onToggle={toggleUserMenuActive}
      />
  )
  const toggleMobileNavigationActive = useCallback(
    () =>
      setMobileNavigationActive(
        (mobileNavigationActive) => !mobileNavigationActive,
      ),
    [],
  );
  const TopBarMarkUP = (
    <TopBar 
          showNavigationToggle 
          userMenu={UserMenu}
          onNavigationToggle={toggleMobileNavigationActive}
          />
  )
  
  return (
    <div style={{height: '250px'}}>
      <AppProvider
        theme={CustomProviderTheme()}
      >
        <Frame topBar={TopBarMarkUP} 
          navigation={SideBar()}
          showMobileNavigation={mobileNavigationActive}
          skipToContentTarget={skipToContentRef.current}
          onNavigationDismiss={toggleMobileNavigationActive}
        >
          <Page>
            <Layout>
              <Layout.Section>
                {props.children}
              </Layout.Section>
            </Layout>
          </Page>
        </Frame>
      </AppProvider>
    </div>
  );
}
