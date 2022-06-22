import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import '@scss/Home.scss';

import SideBar from '@components/SideBar.jsx';
import NavBar from '@components/NavBar.jsx';
import ChatWindow from '@components/ChatWindow.jsx';

import { actions as chatActions } from '@store/chat';
import socket from '@src/socket';

function Home() {
  const chat = useSelector(state => state.chat);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('receive private msg', data => {
      dispatch(chatActions.updateUnseenMsgsById(data.senderId));
      if (chat.getMsgs.data.id === data.senderId)
        dispatch(chatActions.addMsg(data));
    });
    return () => socket.removeAllListeners('receive private msg');
  }, [chat.getMsgs.data.id]);

  return (
    <>
      <NavBar />
      <SideBar />
      {chat.getMsgs.data.id ? (
        <ChatWindow />
      ) : (
        <div className='no-chatwindow-container'></div>
      )}
    </>
  );
}

export default Home;
