
import { handleRequest } from '../../utils/axios';

export const findExamSituationsAPI = async (data) => {
  const config = {
    url: '/exam-situation/search',
    method: 'POST',
    data
  };
  return handleRequest(config);
};

export const getExamSituationByIdAPI = async (id) => {
  const config = {
    url: `/exam-situation/${id}`,
    method: 'GET'
  };
  return handleRequest(config);
};

export const createExamSituationAPI = async (data) => {
  const config = {
    url: '/exam-situation/',
    method: 'POST',
    data
  };

  return handleRequest(config);
};

export const updateExamSituationAPI = async (data) => {
  const config = {
    url: '/exam-situation/',
    method: 'PUT',
    data
  };

  return handleRequest(config);
};

export const deleteExamSituationAPI = async (id) => {
  const config = {
    url: `/exam-situation/${id}`,
    method: 'DELETE'
  };
  return handleRequest(config);
};

export const deleteExamSituationsAPI = async (ids) => {
  const config = {
    url: `/exam-situation/all/${ids.toString()}`,
    method: 'DELETE'
  };
  return handleRequest(config);
};
