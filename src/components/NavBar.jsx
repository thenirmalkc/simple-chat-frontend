import { useDispatch } from 'react-redux';

import { actions as authActions } from '@store/auth';

function NavBar() {
  const dispatch = useDispatch();

  const handleClick = () => dispatch(authActions.apiLogout());

  return (
    <div className='navbar-container'>
      <div className='navbar-item'>
        <button onClick={handleClick}>Logout</button>
      </div>
    </div>
  );
}

export default NavBar;
