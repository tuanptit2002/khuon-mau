import { createSlice } from '@reduxjs/toolkit';
import { findMediaCachesAPI, getMediaCacheKeysByNameAPI } from '../../../service/gplx/gplx.cache.service';

const initialState = {
  isLoading: false,
  error: null,
  totalElements: 0,
  totalPages: 0,
  numberOfElements: 0,
  caches: [],
  keys: [],
};

const slice = createSlice({
  name: 'mediaCache',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    setCaches(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.caches = response.data;
      state.totalElements = response.totalElements;
      state.totalPages = response.totalPages;
      state.numberOfElements = response.numberOfElements;
    },
    setKeys(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.keys = response.data;
      state.totalElements = response.totalElements;
      state.totalPages = response.totalPages;
      state.numberOfElements = response.numberOfElements;
    },
  }
});

// Reducer
export default slice.reducer;
// Actions
export function getMediaCaches() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    // read state from rootReducer
    const resp = await findMediaCachesAPI();

    if (resp.code === '200')
      dispatch(slice.actions.setCaches(resp));
    else
      dispatch(slice.actions.hasError(resp));
  };
}

export function getMediaCacheKeys(cacheName) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    const resp = await getMediaCacheKeysByNameAPI(cacheName);
    if (resp.code === '200')
      dispatch(slice.actions.setKeys(resp));
    else
      dispatch(slice.actions.hasError(resp));
  };
}