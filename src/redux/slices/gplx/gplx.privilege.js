import { createSlice } from '@reduxjs/toolkit';
import { findMediaPrivilegesAPI, getMediaPrivilegeByIdAPI } from '../../../service/gplx/gplx.privilege.service';
// utils

const initialState = {
  isLoading: false,
  error: null,
  totalElements: 0,
  totalPages: 0,
  numberOfElements: 0,
  privileges: [],
  privilege: null,
  search: {
    page: 0,
    size: 10,
    value: '',
    orders: [
      {
        order: 'desc',
        property: 'id',
      },
    ],
  },
};

const slice = createSlice({
  name: 'mediaPrivilege',
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
    setPrivileges(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.privileges = response.data;
      state.totalElements = response.totalElements;
      state.totalPages = response.totalPages;
      state.numberOfElements = response.numberOfElements;
    },
    setPrivilege(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.privilege = response.data;
    },
    setMediaPrivilegeSearch(state, action) {
      state.isLoading = false;
      state.search = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;
// Actions
export const { setMediaPrivilegeSearch } = slice.actions;
// ----------------------------------------------------------------------

export function getMediaPrivileges() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    // read state from rootReducer
    const { mediaPrivilege } = getState();

    const resp = await findMediaPrivilegesAPI({ ...mediaPrivilege.search, value: `%${mediaPrivilege.search.value}%` });

    if (resp.code === '200') dispatch(slice.actions.setPrivileges(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}

export function getMediaPrivilege(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    const resp = await getMediaPrivilegeByIdAPI(id);
    if (resp.code === '200') dispatch(slice.actions.setPrivilege(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}
