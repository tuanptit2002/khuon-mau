import { handleRequest } from '../../utils/axios';

export const findGPLXSituationAPI = async (data) => {
  const config = {
    url: '/situation/search',
    method: 'POST',
    data
  };
  return handleRequest(config);
};

export const getGPLXSituationByIdAPI = async (id) => {
  const config = {
    url: `/situation/${id}`,
    method: 'GET'
  };
  return handleRequest(config);
};

export const createGPLXSituationAPI = async (data) => {
  const { fileObj, ...others } = data;

  const formData = new FormData();
  formData.append("file", fileObj);
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const key in others) {
    if (key === 'category')
      formData.append('category.id', others[key].id);
    else
      formData.append(key, others[key]);
  }

  const config = {
    url: '/situation/',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };

  return handleRequest(config);
};

export const updateGPLXSituationAPI = async (data) => {
  const config = {
    url: '/situation/',
    method: 'PUT',
    data
  };

  return handleRequest(config);
};

export const processGPLXSituationAPI = async (id) => {
  const config = {
    url: `/situation/process/${id}`,
    method: 'PUT'
  };
  return handleRequest(config);
};

export const deleteGPLXSituationAPI = async (id) => {
  const config = {
    url: `/situation/${id}`,
    method: 'DELETE'
  };
  return handleRequest(config);
};

export const deleteGPLXSituationsAPI = async (ids) => {
  const config = {
    url: `/situation/all/${ids.toString()}`,
    method: 'DELETE'
  };
  return handleRequest(config);
};
