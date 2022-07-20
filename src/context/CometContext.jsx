import React, { createContext, useState, useEffect } from "react";

export const CometContext = createContext(null);

export const CometProvider = ({ children }) => {
  const [cometChat, setCometChat] = useState(null);

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
  useEffect(() => {
    initCometChat();
  }, []);

  return (
    <CometContext.Provider value={ cometChat }>
      {children}
    </CometContext.Provider>
  )
};