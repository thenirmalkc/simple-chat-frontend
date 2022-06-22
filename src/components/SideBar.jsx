import { useEffect } from 'react';

import SideBarItem from '@components/SideBarItem.jsx';

import { useDispatch, useSelector } from 'react-redux';
import { actions as registeredUsersActions } from '@store/registeredUsers';
import { actions as chatActions } from '@store/chat';

function SideBar() {
  const user = useSelector(state => state.user);
  const chat = useSelector(state => state.chat);
  const registeredUsers = useSelector(state => state.registeredUsers);
  const reversedRegisteredUsers = [...registeredUsers.data.users]
    .reverse()
    .filter(registeredUser => registeredUser._id !== user.data.id);
  const dispatch = useDispatch();

  useEffect(() => {
    const ac = new AbortController();
    dispatch(
      registeredUsersActions.apiGetRegisteredUsers({ signal: ac.signal })
    );
    dispatch(chatActions.apiGetUnseenMsgs({ signal: ac.signal }));
    return () => ac.abort();
  }, []);

  useEffect(() => {
    if (registeredUsers.status !== 'SUCCESS') return;

    for (const registeredUser of registeredUsers.data.users) {
      if (user.data.id === registeredUser._id) continue;
      dispatch(
        chatActions.addUnseenMsgs({
          receiverId: user.data.id,
          senderId: registeredUser._id,
          unseen: 0
        })
      );
    }

    dispatch(chatActions.apiGetUnseenMsgs());
  }, [registeredUsers.status]);

  // When the sidebar item is clicked
  useEffect(() => {
    if (!chat.getMsgs.data.id) return;
    const ac = new AbortController();
    dispatch(chatActions.apiGetChatMsgs({ signal: ac.signal }));
    return () => ac.abort();
  }, [chat.getMsgs.data.id]);

  useEffect(() => {
    if (chat.getMsgs.status !== 'SUCCESS') return;
    dispatch(chatActions.resetUnseenMsgsById(chat.getMsgs.data.id));
  }, [chat.getMsgs.status]);

  const handleClick = id => () => {
    dispatch(chatActions.setGetMsgsUser(id));
    dispatch(chatActions.setSendMsgUser(id));
  };

  return (
    <div className='sidebar-container'>
      <div className='sidebar-title-container'>
        <div className='sidebar-title'>Registered Users</div>
      </div>
      <div className='sidebar-registered-users'>
        {registeredUsers.status === 'SUCCESS' &&
        chat.unseenMsgs.status === 'SUCCESS' ? (
          reversedRegisteredUsers.map(registeredUser => (
            <SideBarItem
              key={registeredUser._id}
              data={{
                registeredUser,
                unseenMsgs: chat.unseenMsgs.data.find(
                  x => x.senderId === registeredUser._id
                )?.unseen
              }}
              handleOnClick={handleClick(registeredUser._id)}
              addClass={
                chat.getMsgs.data.id === registeredUser._id
                  ? 'sidebar-selected-registered-user'
                  : ''
              }
            />
          ))
        ) : (
          <div>
            <div className='sidebar-loading-container'>
              <div className='sidebar-loading'></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SideBar;
