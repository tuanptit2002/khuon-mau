
import { handleRequest } from '../../utils/axios';

export const findMediaRolesAPI = async (data) => {
  const config = {
    url: '/role/search',
    method: 'POST',
    data
  };
  return handleRequest(config);
};

export const getMediaRoleByIdAPI = async (id) => {
  const config = {
    url: `/role/${id}`,
    method: 'GET'
  };
  return handleRequest(config);
};

export const createMediaRoleAPI = async (data) => {
  const config = {
    url: '/role/',
    method: 'POST',
    data
  };

  return handleRequest(config);
};

export const updateMediaRoleAPI = async (data) => {
  const config = {
    url: '/role/',
    method: 'PUT',
    data
  };

  return handleRequest(config);
};

export const deleteMediaRoleAPI = async (id) => {
  const config = {
    url: `/role/${id}`,
    method: 'DELETE'
  };
  return handleRequest(config);
};

export const deleteMediaRolesAPI = async (ids) => {
  const config = {
    url: `/role/all/${ids.toString()}`,
    method: 'DELETE'
  };
  return handleRequest(config);
};
