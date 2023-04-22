
import { handleRequest } from '../../utils/axios';

export const findExamsAPI = async (data) => {
  const config = {
    url: '/exam/search',
    method: 'POST',
    data
  };
  return handleRequest(config);
};

export const getExamByIdAPI = async (id) => {
  const config = {
    url: `/exam/${id}`,
    method: 'GET'
  };
  return handleRequest(config);
};

export const createExamAPI = async (data) => {
  const config = {
    url: '/exam/',
    method: 'POST',
    data
  };

  return handleRequest(config);
};

export const updateExamAPI = async (data) => {
  const config = {
    url: '/exam/',
    method: 'PUT',
    data
  };

  return handleRequest(config);
};

export const deleteExamAPI = async (id) => {
  const config = {
    url: `/exam/${id}`,
    method: 'DELETE'
  };
  return handleRequest(config);
};

export const deleteExamsAPI = async (ids) => {
  const config = {
    url: `/exam/all/${ids.toString()}`,
    method: 'DELETE'
  };
  return handleRequest(config);
};
