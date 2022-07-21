import React, { createContext, useState, useEffect } from "react";

export const CometContext = createContext(null);

export const CometProvider = ({ children }) => {
  const [cometChat, setCometChat] = useState(null);
  const [user, setUser] = useState(null);

  const values = { cometChat, user, setUser };

  const initCometChat = async () => {
    const { CometChat } = await import("@cometchat-pro/chat");
    const appID = `${process.env.REACT_APP_COMETCHAT_APP_ID}`;
    const region = `${process.env.REACT_APP_COMETCHAT_REGION}`;
    const appSetting = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(region)
      .build();
    CometChat.init(appID, appSetting)
      .then(
        () => {
          setCometChat(() => CometChat);
        },
        (error) => {
          console.log("error", error);
        }
      );
  };

  const initAuthUser = () => {
    const authenticatedUser = localStorage.getItem("auth");
    if (authenticatedUser) {
      setUser(JSON.parse(authenticatedUser));
    }
  };

  useEffect(() => {
    initCometChat();
    initAuthUser();
  }, []);

  return (
    <CometContext.Provider value={ values }>
      {children}
    </CometContext.Provider>
  )
};