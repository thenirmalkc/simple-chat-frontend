import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Pages
import Login from '@pages/Login.jsx';
import Register from '@pages/Register.jsx';
import Home from '@pages/Home.jsx';
import PageNotFound from '@pages/PageNotFound.jsx';

function Router() {
  const auth = useSelector(state => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            auth.data.loggedIn ? (
              <Navigate to='/home' />
            ) : (
              <Navigate to='/login' />
            )
          }
        />
        <Route
          path='/login'
          element={auth.data.loggedIn ? <Navigate to='/home' /> : <Login />}
        />
        <Route
          path='/register'
          element={auth.data.loggedIn ? <Navigate to='/home' /> : <Register />}
        />
        <Route
          path='/home'
          element={auth.data.loggedIn ? <Home /> : <Navigate to='/login' />}
        />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
