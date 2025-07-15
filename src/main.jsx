import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './assets/all.scss';
import App from './App.jsx';
import { Provider } from 'react-redux';
import store from './store';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/3frontend">
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);
