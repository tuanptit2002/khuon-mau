import { handleRequest } from '../../utils/axios';

export const findMediaUsersAPI = async (data) => {
  const config = {
    url: '/user/search',
    method: 'POST',
    data
  };
  return handleRequest(config);
};

export const updateMediaUserRoleAPI = async (data) => {
  const config = {
    url: '/user/role',
    method: 'PUT',
    data
  };

  return handleRequest(config);
};
export const updateMediaUserStatusAPI = async (data) => {
  const config = {
    url: '/user/status',
    method: 'PUT',
    data
  };

  return handleRequest(config);
};

export const updateMediaUserPhoneAPI = async (data) => {
  const config = {
    url: '/user/phone',
    method: 'PUT',
    data
  };

  return handleRequest(config);
};

export const updateMediaUserEmailAPI = async (data) => {
  const config = {
    url: '/user/email',
    method: 'PUT',
    data
  };

  return handleRequest(config);
};

export const updateMediaUserInfoAPI = async (data) => {
  const config = {
    url: '/user/info',
    method: 'PUT',
    data
  };

  return handleRequest(config);
};

export const deleteMediaUserAPI = async (id) => {
  const config = {
    url: `/user/${id}`,
    method: 'DELETE'
  };
  return handleRequest(config);
};

export const deleteMediaUsersAPI = async (ids) => {
  const config = {
    url: `/user/all/${ids.toString()}`,
    method: 'DELETE'
  };
  return handleRequest(config);
};

export const getMediaUserByIdAPI = async (id) => {
  const config = {
    url: `/user/${id}`,
    method: 'GET'
  };
  return handleRequest(config);
};

export const getMediaCurrentUserAPI = async () => {
  const config = {
    url: `/user/me`,
    method: 'GET'
  };
  return handleRequest(config);
};
