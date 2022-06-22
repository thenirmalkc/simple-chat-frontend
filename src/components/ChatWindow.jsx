import { useEffect, useState, useRef } from 'react';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector, useDispatch } from 'react-redux';
import { actions as chatActions } from '@store/chat';
import socket from '@src/socket';

function ChatWindow() {
  const scrollDiv = useRef(null);
  const sendMsgAC = useRef(new AbortController());
  const user = useSelector(state => state.user);
  const chat = useSelector(state => state.chat);
  const dispatch = useDispatch();
  const [msg, setMsg] = useState('');
  const handleInputChange = e => setMsg(e.target.value);

  useEffect(() => {
    if (chat.getMsgs.status !== 'SUCCESS') return;
    scrollDiv.current.scrollIntoView({
      block: 'end',
      inline: 'nearest',
      behavior: 'auto'
    });
  }, [chat.getMsgs.status]);

  useEffect(() => {
    if (chat.sendMsg.status !== 'SUCCESS') return;
    dispatch(chatActions.addMsg(chat.sendMsg.data.msg));
    setMsg('');
  }, [chat.sendMsg.status]);

  useEffect(() => {
    if (chat.getMsgs.status !== 'SUCCESS') return;
    return () => {
      scrollDiv.current.scrollIntoView({
        block: 'end',
        inline: 'nearest',
        behavior: 'smooth'
      });
    };
  }, [chat.getMsgs.data.msgs.length]);

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleClick();
  }

  function handleClick() {
    if (!msg) return;
    dispatch(
      chatActions.apiSendChatMsg({
        signal: sendMsgAC.current.signal,
        body: { message: msg }
      })
    );
  }

  // Resetting unseen msgs when msg is sent
  useEffect(() => {
    if (chat.sendMsg.status !== 'SUCCESS') return;
    dispatch(chatActions.resetUnseenMsgsById(chat.sendMsg.data.id));
  }, [chat.sendMsg.status]);

  // Abort fetch request
  useEffect(
    () => () => {
      sendMsgAC.current.abort();
      setMsg('');
      sendMsgAC.current = new AbortController();
    },
    [chat.sendMsg.data.id]
  );

  // Socket
  useEffect(() => {
    if (chat.sendMsg.status !== 'SUCCESS') return;
    socket.emit('send private msg', chat.sendMsg.data.msg);
  }, [chat.sendMsg.status]);

  return (
    <div className='chatwindow-container'>
      <div className='chatwindow-container-top'>
        {chat.getMsgs.status === 'SUCCESS' ? (
          chat.getMsgs.data.msgs.map(msg => (
            <div key={msg._id} className='chatwindow-chat-msg-container'>
              <div
                className={`chatwindow-chat-msg ${
                  user.data.id === msg.senderId
                    ? 'chatwindow-chat-msg-right'
                    : 'chatwindow-chat-msg-left'
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))
        ) : (
          <div className='chatwindow-loading-container'>
            <div className='chatwindow-loading'></div>
          </div>
        )}
        <div ref={scrollDiv}></div>
      </div>
      <div className='chatwindow-container-bottom'>
        <div className='chatwindow-input-field'>
          <input
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            type='text'
            value={msg}
          />
        </div>
        <div className='chatwindow-icon' onClick={handleClick}>
          <FontAwesomeIcon icon={faPaperPlane} size={'2xl'} />
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
