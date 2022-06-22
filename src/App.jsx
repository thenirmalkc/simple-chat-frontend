import '@scss/index.scss';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Router from '@src/Router.jsx';
import socket from '@src/socket';

import { actions as userActions } from '@store/user';
import { actions as authActions } from '@store/auth';

function App() {
  const [init, setInit] = useState(false);
  const auth = useSelector(state => state.auth);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  // Refresh webpage
  useEffect(() => {
    if (localStorage.refreshToken) dispatch(authActions.apiRefreshToken());
  }, []);

  // Init state
  useEffect(() => {
    // Dispatch all Init Actions here
    if (auth.data.loggedIn) {
      dispatch(userActions.apiGetUser());
    }
  }, [auth.data.loggedIn]);

  // After all actions and dispatched all store in state
  useEffect(() => {
    user.status === 'SUCCESS' && setInit(true);
  }, [user.status]);

  // Socket
  useEffect(() => {
    if (!init) return;
    socket.emit('SetUser', { userId: user.data.id });
  }, [init]);

  if (localStorage.refreshToken) {
    if (auth.status === 'FAILED' || init) return <Router />;
    return (
      <div className='loading-container'>
        <div className='loading'></div>
      </div>
    );
  } else {
    if (auth.data.loggedIn && !init)
      return (
        <div className='loading-container'>
          <div className='loading'></div>
        </div>
      );
    return <Router />;
  }
}

export default App;
