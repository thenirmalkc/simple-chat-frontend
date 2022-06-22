import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { actions as authActions } from '@store/auth';
import { actions as validationErrorActions } from '@store/validationError';

import InputField from '@components/InputField.jsx';
import '@scss/Login.scss';

function Login() {
  const loginAC = useRef(new AbortController());
  const validationError = useSelector(state => state.validationError);
  const auth = useSelector(state => state.auth);

  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailChange = e => setEmail(e.target.value);
  const passwordChange = e => setPassword(e.target.value);

  function handleInputKeyDown(e) {
    if (e.key === 'Enter') handleLogin();
  }

  function handleLogin() {
    dispatch(
      authActions.apiLogin({
        signal: loginAC.current.signal,
        body: { email, password }
      })
    );
  }

  function handleInputFocus(e) {
    dispatch(validationErrorActions.resetLoginMsg(e.target.name));
  }

  useEffect(
    () => () => {
      loginAC.current.abort();
      dispatch(authActions.resetError());
      dispatch(validationErrorActions.resetLoginAllMsg());
    },
    []
  );

  return (
    <div className='login-container'>
      <div className='login-inner-container'>
        <div className={auth.error.code ? 'login-err-container' : ''}>
          {auth.error.msg}
        </div>
        <div className='login-form-container'>
          <div className='login-title'>Login</div>
          <div className='login-input-field'>
            <InputField
              id='email'
              label='Email'
              type='text'
              name='email'
              handleOnChange={emailChange}
              handleOnInputFocus={handleInputFocus}
              handleOnInputKeyDown={handleInputKeyDown}
            />
            <div className='validation-error'>
              {validationError.login.email}
            </div>
          </div>
          <div className='login-input-field'>
            <InputField
              id='password'
              label='Password'
              type='password'
              name='password'
              handleOnChange={passwordChange}
              handleOnInputFocus={handleInputFocus}
              handleOnInputKeyDown={handleInputKeyDown}
            />
            <div className='validation-error'>
              {validationError.login.password}
            </div>
          </div>
          <div className='login-btn-div'>
            <button onClick={handleLogin}>Login</button>
          </div>
          <div className='login-link-div'>
            <Link to='/register'>Click here to register</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
