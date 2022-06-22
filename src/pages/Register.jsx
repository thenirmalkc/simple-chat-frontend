import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { actions as authActions } from '@store/auth';
import { actions as validationErrorActions } from '@store/validationError';

import InputField from '@components/InputField.jsx';
import '@scss/Register.scss';

function Register() {
  const registerAC = useRef(new AbortController());
  const validationError = useSelector(state => state.validationError);
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const firstNameChange = e => setFirstName(e.target.value);
  const lastNameChange = e => setLastName(e.target.value);
  const emailChange = e => setEmail(e.target.value);
  const addressChange = e => setAddress(e.target.value);
  const passwordChange = e => setPassword(e.target.value);
  const confirmPasswordChange = e => setConfirmPassword(e.target.value);

  function handleInputKeyDown(e) {
    if (e.key === 'Enter') handleRegister();
  }

  function handleRegister() {
    // Register User
    if (password === confirmPassword)
      dispatch(
        authActions.apiRegisterUser({
          signal: registerAC.current.signal,
          body: {
            firstName,
            lastName,
            email,
            address,
            password
          }
        })
      );
  }

  function handleInputFocus(e) {
    dispatch(validationErrorActions.resetRegisterMsg(e.target.name));
  }

  useEffect(
    () => () => {
      registerAC.current.abort();
      dispatch(authActions.resetError());
      dispatch(validationErrorActions.resetRegisterAllMsg());
    },
    []
  );

  return (
    <div className='register-container'>
      <div className='register-inner-container'>
        <div className={auth.error.code ? 'register-err-container' : ''}>
          {auth.error.msg}
        </div>
        <div className='register-form-container'>
          <div className='register-title'>Register</div>
          <div className='register-input-field'>
            <InputField
              id='firstName'
              label='First name'
              type='text'
              name='firstName'
              handleOnChange={firstNameChange}
              handleOnInputFocus={handleInputFocus}
              handleOnInputKeyDown={handleInputKeyDown}
              className={'input-blue'}
            />
            <div className='validation-error'>
              {validationError.register.firstName}
            </div>
          </div>
          <div className='register-input-field'>
            <InputField
              id='lastName'
              label='Last name'
              type='text'
              name='lastName'
              handleOnChange={lastNameChange}
              handleOnInputFocus={handleInputFocus}
              handleOnInputKeyDown={handleInputKeyDown}
              className={'input-blue'}
            />
            <div className='validation-error'>
              {validationError.register.lastName}
            </div>
          </div>
          <div className='register-input-field'>
            <InputField
              id='email'
              label='Email'
              type='email'
              name='email'
              handleOnChange={emailChange}
              handleOnInputFocus={handleInputFocus}
              handleOnInputKeyDown={handleInputKeyDown}
              className={'input-blue'}
            />
            <div className='validation-error'>
              {validationError.register.email}
            </div>
          </div>
          <div className='register-input-field'>
            <InputField
              id='address'
              label='Address'
              type='text'
              name='address'
              handleOnChange={addressChange}
              handleOnInputFocus={handleInputFocus}
              handleOnInputKeyDown={handleInputKeyDown}
              className={'input-blue'}
            />
            <div className='validation-error'>
              {validationError.register.address}
            </div>
          </div>
          <div className='register-input-field'>
            <InputField
              id='password'
              label='Password'
              type='password'
              name='password'
              handleOnChange={passwordChange}
              handleOnInputFocus={handleInputFocus}
              handleOnInputKeyDown={handleInputKeyDown}
              className={'input-blue'}
            />
            <div className='validation-error'>
              {validationError.register.password}
            </div>
          </div>
          <div className='register-input-field'>
            <InputField
              id='confirmPassword'
              label='Confirm password'
              type='password'
              name='confirmPassword'
              handleOnChange={confirmPasswordChange}
              handleOnInputKeyDown={handleInputKeyDown}
              className={
                confirmPassword && password === confirmPassword
                  ? 'input-green'
                  : 'input-red'
              }
            />
          </div>
          <div className='register-btn-div'>
            <button onClick={handleRegister}>Register</button>
          </div>
          <div className='register-link-div'>
            <Link to='/login'>Click here to login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
