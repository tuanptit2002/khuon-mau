import { handleRequest } from '../../utils/axios';

export const findMediaCachesAPI = async () => {
  const config = {
    url: '/cache/',
    method: 'GET',
  };
  return handleRequest(config);
};

export const deleteMediaCacheAPI = async (data) => {
  const config = {
    url: `/cache/`,
    method: 'DELETE',
    data
  };
  return handleRequest(config);
};

export const getMediaCacheKeysByNameAPI = async (name) => {
  const config = {
    url: `/cache/${name}/keys`,
    method: 'GET'
  };
  return handleRequest(config);
};