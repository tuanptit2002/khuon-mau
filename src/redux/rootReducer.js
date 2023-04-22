import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import mediaCacheReducer from './slices/gplx/gplx.cache';
import categoryReducer from './slices/gplx/gplx.category';
import examReducer from './slices/gplx/gplx.exam';
import mediaPrivilegeReducer from './slices/gplx/gplx.privilege';
import mediaRoleReducer from './slices/gplx/gplx.role';
import situationReducer from './slices/gplx/gplx.situation';
import mediaUserReducer from './slices/gplx/gplx.user';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error']
};

const rootReducer = combineReducers({
  mediaCache: persistReducer({ ...rootPersistConfig, key: "gplx-cache" }, mediaCacheReducer),
  mediaPrivilege: persistReducer({ ...rootPersistConfig, key: "gplx-privilege" }, mediaPrivilegeReducer),
  mediaRole: persistReducer({ ...rootPersistConfig, key: "gplx-role" }, mediaRoleReducer),
  mediaUser: persistReducer({ ...rootPersistConfig, key: "gplx-user" }, mediaUserReducer),
  situation: persistReducer({ ...rootPersistConfig, key: "gplx-situation" }, situationReducer),
  category: persistReducer({ ...rootPersistConfig, key: "gplx-category" }, categoryReducer),
  exam: persistReducer({ ...rootPersistConfig, key: "gplx-exam" }, examReducer),
});

export { rootPersistConfig, rootReducer };

