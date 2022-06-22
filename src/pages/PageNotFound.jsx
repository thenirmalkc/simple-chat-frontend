import '@scss/PageNotFound.scss';

import { useNavigate } from 'react-router-dom';

function PageNotFound() {
  const navigate = useNavigate();

  const handleHomeBtnClick = () => navigate('/home');
  const handleLoginBtnClick = () => navigate('/login');

  return (
    <div className='pagenotfound-container'>
      <div className='pagenotfound-inner-container'>
        <div className='pagenotfound-error-code'>404</div>
        <div className='pagenotfound-title'>Page Not Found</div>
        <div className='pagenotfound-msg'>
          The page you request could not be found
        </div>
        <div className='pagenotfound-btn-container'>
          <div className='pagenotfound-home-btn'>
            <button onClick={handleHomeBtnClick}>Home</button>
          </div>
          <div className='pagenotfound-login-btn'>
            <button onClick={handleLoginBtnClick}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;
