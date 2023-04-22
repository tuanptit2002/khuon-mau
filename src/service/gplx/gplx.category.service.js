import { handleRequest } from "../../utils/axios";

export const findCategoriesAPI = async (data) => {
  const config = {
    url: '/category/search',
    method: 'POST',
    data
  };
  return handleRequest(config);
};

export const getCategoryByIdAPI = async (id) => {
  const config = {
    url: `/category/${id}`,
    method: 'GET'
  };
  return handleRequest(config);
};

export const createCategoryAPI = async (data) => {
  const config = {
    url: '/category/',
    method: 'POST',
    data
  };

  return handleRequest(config);
};

export const updateCategoryAPI = async (data) => {
  const config = {
    url: '/category/',
    method: 'PUT',
    data
  };

  return handleRequest(config);
};

export const deleteCategoryAPI = async (id) => {
  const config = {
    url: `/category/${id}`,
    method: 'DELETE'
  };
  return handleRequest(config);
};

export const deleteCategoriesAPI = async (ids) => {
  const config = {
    url: `/category/all/${ids.toString()}`,
    method: 'DELETE'
  };
  return handleRequest(config);
};