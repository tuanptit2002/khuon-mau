
import { handleRequest } from '../../utils/axios';

export const findMediaPrivilegesAPI = async (data) => {
  const config = {
    url: '/privilege/search',
    method: 'POST',
    data
  };
  return handleRequest(config);
};

export const getMediaPrivilegeByIdAPI = async (id) => {
  const config = {
    url: `/privilege/${id}`,
    method: 'GET'
  };
  return handleRequest(config);
};

export const createMediaPrivilegeAPI = async (data) => {
  const config = {
    url: '/privilege/',
    method: 'POST',
    data
  };

  return handleRequest(config);
};

export const updateMediaPrivilegeAPI = async (data) => {
  const config = {
    url: '/privilege/',
    method: 'PUT',
    data
  };

  return handleRequest(config);
};

export const deleteMediaPrivilegeAPI = async (id) => {
  const config = {
    url: `/privilege/${id}`,
    method: 'DELETE'
  };
  return handleRequest(config);
};

export const deleteMediaPrivilegesAPI = async (ids) => {
  const config = {
    url: `/privilege/all/${ids.toString()}`,
    method: 'DELETE'
  };
  return handleRequest(config);
};
