import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';

import './socket';

// Store
import store from '@store/index';

// Init
import App from '@src/App.jsx';

const root = createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
