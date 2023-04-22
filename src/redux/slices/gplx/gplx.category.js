import { createSlice } from '@reduxjs/toolkit';
import { findCategoriesAPI, getCategoryByIdAPI } from '../../../service/gplx/gplx.category.service';
// utils

const initialState = {
  isLoading: false,
  error: null,
  totalElements: 0,
  totalPages: 0,
  numberOfElements: 0,
  categories: [],
  category: null,
  search: {
    page: 0,
    size: 10,
    value: '',
    orders: [
      {
        order: 'desc',
        property: 'createdAt',
      },
    ],
  },
};

const slice = createSlice({
  name: 'gplxCategory',
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
    setCategories(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.categories = response.data;
      state.totalElements = response.totalElements;
      state.totalPages = response.totalPages;
      state.numberOfElements = response.numberOfElements;
    },
    setCategory(state, action) {
      state.isLoading = false;
      const response = action.payload;
      state.category = response.data;
    },
    setCategorySearch(state, action) {
      state.isLoading = false;
      state.search = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;
// Actions
export const { setCategorySearch } = slice.actions;
// ----------------------------------------------------------------------

export function getCategories() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.startLoading());
    // read state from rootReducer
    const { category } = getState();

    const resp = await findCategoriesAPI({ ...category.search, value: `%${category.search.value}%` });

    if (resp.code === '200') dispatch(slice.actions.setCategories(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}

export function getCategory(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    const resp = await getCategoryByIdAPI(id);
    if (resp.code === '200') dispatch(slice.actions.setCategory(resp));
    else dispatch(slice.actions.hasError(resp));
  };
}
