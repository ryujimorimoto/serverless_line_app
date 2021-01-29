import React, {useCallback, useState, useRef} from 'react';
import {AppProvider, TextStyle, ContextualSaveBar, Frame, Layout, Page, SettingToggle, TopBar} from '@shopify/polaris';
import CustomProviderTheme from "../additionalAtoms/CustomProviderTheme"
import SideBar from "../moduls/SideBar"

export default function LayoutFrame() {
  const skipToContentRef = useRef(null);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const defaultState = useRef({
    emailFieldValue: "dharma@jadedpixel.com",
    nameFieldValue: "Jaded Pixel"
  });
  const userMenuActions = [
    {
      items: [{content: 'Community forums'}],
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
        name="Ryuji"
        detail={storeName}
        initials="R"
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
          
        </Frame>
      </AppProvider>
    </div>
  );
}
