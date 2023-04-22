import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import firebase from 'firebase/compat/app';
import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';
import { FIREBASE_API } from '../config';
// import { getMediaCurrentUserAPI } from 'src/service/gplx/gplx.user.service';

// ----------------------------------------------------------------------

const firebaseApp = firebase.initializeApp(FIREBASE_API);

const AUTH = getAuth(firebaseApp);

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const reducer = (state, action) => {
  if (action.type === 'INITIALISE') {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  }

  return state;
};

const AuthContext = createContext({
  ...initialState,
  method: 'firebase',
  loginWithGoogle: () => Promise.resolve(),
  loginWithFaceBook: () => Promise.resolve(),
  loginWithApple: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(
    () =>
      onAuthStateChanged(AUTH, async (user) => {
        if (user) {
          // const { code, data } = await getMediaCurrentUserAPI();

          // if (code === '200') {
          dispatch({
            type: 'INITIALISE',
            payload: { isAuthenticated: true, user: { ...user, role: { role: 'ROLE_ADMIN' } } },
          });
          // } else
          //   logout();S
        } else {
          dispatch({
            type: 'INITIALISE',
            payload: { isAuthenticated: false, user: null },
          });
        }
      }),
    [dispatch]
  );

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(AUTH, provider);
  };

  const loginWithFaceBook = () => {
    const provider = new FacebookAuthProvider();
    return signInWithPopup(AUTH, provider);
  };

  const loginWithApple = () => {
    const provider = new OAuthProvider('apple.com');
    return signInWithPopup(AUTH, provider);
  };

  const logout = () => signOut(AUTH);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'firebase',
        loginWithGoogle,
        loginWithFaceBook,
        loginWithApple,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
