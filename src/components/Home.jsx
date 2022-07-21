import React, { useContext } from 'react'

import Header from './layout/Header'
import { CometContext } from '../context/CometContext'
import { CometChatUI } from '../cometchat-pro-react-ui-kit/CometChatWorkspace/src';

const Home = () => {
  const { cometChat } = useContext(CometContext);

  if (!cometChat) {
    return (
      <>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="chat">
        <CometChatUI />
      </div>
    </>
  )
}

export default Home