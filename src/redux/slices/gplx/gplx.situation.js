import { createSlice } from '@reduxjs/toolkit';
import { findGPLXSituationAPI, getGPLXSituationByIdAPI } from '../../../service/gplx/gplx.situation.service';
// utils

const initialState = {
  isLoading: false,
  error: null,
  totalElements: 0,
  totalPages: 0,
  numberOfElements: 0,
  situations: [],
  situation: null,
  search: {
    page: 0,
    size: 10,
    value: '',
    orders: [
      {
        order: "desc",
        property: 'createdAt'
      }
    ]
  }
};

const slice = createSlice({
  name: 'gplxSituation',
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
    setSituations(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.situations = response.data;
      state.totalElements = response.totalElements;
      state.totalPages = response.totalPages;
      state.numberOfElements = response.numberOfElements;
    },
    setSituation(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.situation = response.data;
    },
    setGPLXSituationSearch(state, action) {
      state.isLoading = false;
      state.search = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;
// Actions
export const { setGPLXSituationSearch } = slice.actions;
// ----------------------------------------------------------------------

export function getGPLXSituations() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    // read state from rootReducer
    const { situation } = getState();

    const resp = await findGPLXSituationAPI({ ...situation.search, value: `%${situation.search.value}%` });

    if (resp.code === '200')
      dispatch(slice.actions.setSituations(resp));
    else
      dispatch(slice.actions.hasError(resp));
  };
}

export function getGPLXSituation(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    const resp = await getGPLXSituationByIdAPI(id);
    if (resp.code === '200')
      dispatch(slice.actions.setSituation(resp));
    else
      dispatch(slice.actions.hasError(resp));
  };
}