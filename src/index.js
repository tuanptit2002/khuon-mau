// i18n
import './locales/i18n';

// highlight// CSS: 
import './utils/highlight';

// scroll bar
import 'simplebar/src/simplebar.css';

// lightbox
import 'react-image-lightbox/style.css';

// editor
import 'react-quill/dist/quill.snow.css';

// slick-carousel
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import 'video.js/dist/video-js.css';
import 'videojs-http-source-selector/dist/videojs-http-source-selector.css';
// lazy image
import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';

import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/lib/integration/react';
// @mui
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
// redux
import { persistor, store } from './redux/store';
// contexts
import { CollapseDrawerProvider } from './contexts/CollapseDrawerContext';
import { SettingsProvider } from './contexts/SettingsContext';

import { AuthProvider } from './contexts/FirebaseContext';

//
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// ----------------------------------------------------------------------

ReactDOM.render(
  <AuthProvider>
    <HelmetProvider>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <SettingsProvider>
              <CollapseDrawerProvider>
                <BrowserRouter basename={process.env.NODE_ENV === 'production' ? process.env.REACT_APP_ROUTE_BASEPATH : '/'}>
                  <App />
                </BrowserRouter>
              </CollapseDrawerProvider>
            </SettingsProvider>
          </LocalizationProvider>
        </PersistGate>
      </ReduxProvider>
    </HelmetProvider>
  </AuthProvider >,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
