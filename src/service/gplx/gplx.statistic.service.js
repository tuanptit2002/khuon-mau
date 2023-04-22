import { handleRequest } from '../../utils/axios';

export const getMediaStatisticAPI = async () => {
  const config = {
    url: `/statistic/`,
    method: 'GET'
  };
  return handleRequest(config);
};