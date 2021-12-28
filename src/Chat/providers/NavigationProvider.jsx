// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  ReactNode
} from 'react';
import { useLocation } from 'react-router-dom';
import { useMeetingManager } from 'amazon-chime-sdk-component-library-react';

// import routes from '../constants/routes';

// export type NavigationContextType = {
//   showNavbar: boolean;
//   showRoster: boolean;
//   showChat: boolean;
//   showMetrics: boolean;
//   toggleRoster: () => void;
//   toggleChat: () => void;
//   toggleNavbar: () => void;
//   openRoster: () => void;
//   closeRoster: () => void;
//   openChat: () => void;
//   closeChat: () => void;
//   openNavbar: () => void;
//   closeNavbar: () => void;
//   toggleMetrics: () => void;
// };

// type Props = {
//   children: ReactNode;
// };

const NavigationContext = React.createContext<NavigationContextType | null>(
  null
);

const isDesktop = () => window.innerWidth > 768;

const NavigationProvider = ( children ) => {
  const [showNavbar, setShowNavbar] = useState(() => isDesktop());
  const [showRoster, setShowRoster] = useState(() => isDesktop());
  const [showChat, setShowChat] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const isDesktopView = useRef(isDesktop());

  const location = useLocation();
  const meetingManager = useMeetingManager();

  // useEffect(() => {
  //   if (location.pathname.includes(routes.MEETING)) {
  //     return () => {
  //       meetingManager.leave();
  //     };
  //   }
  // }, [location.pathname]);

  useEffect(() => {
    const handler = () => {
      const isResizeDesktop = isDesktop();
      if (isDesktopView.current === isResizeDesktop) {
        return;
      }

      isDesktopView.current = isResizeDesktop;

      if (!isResizeDesktop) {
        setShowNavbar(false);
        setShowRoster(false);
        setShowChat(false);
      } else {
        setShowNavbar(true);
      }
    };

    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const toggleRoster = () => {
    setShowRoster(!showRoster);
    setShowChat(false);
  };

  const toggleChat = () => {
    setShowChat(!showChat);
    setShowRoster(false);
  };

  const toggleNavbar = ()=> {
    setShowNavbar(!showNavbar);
  };

  const toggleMetrics = () => {
    setShowMetrics(currentState => !currentState);
  };

  const openNavbar = () => {
    setShowNavbar(true);
  };

  const closeNavbar = ()=> {
    setShowNavbar(false);
  };

  const openRoster = () => {
    setShowRoster(true);
  };

  const closeRoster = ()=> {
    setShowRoster(false);
  };

  const openChat = () => {
    setShowChat(true);
  };

  const closeChat = () => {
    setShowChat(false);
  };

  const providerValue = {
    showNavbar,
    showRoster,
    showChat,
    showMetrics,
    toggleRoster,
    toggleChat,
    toggleNavbar,
    toggleMetrics,
    openRoster,
    closeRoster,
    openChat,
    closeChat,
    openNavbar,
    closeNavbar
  };
  return (
    <NavigationContext.Provider value={providerValue}>
      {children}
    </NavigationContext.Provider>
  );
};

const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw Error('Use useNavigation in NavigationProvider');
  }
  return context;
};

export { NavigationProvider, useNavigation };
