import { Paper, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import useLocales from '../hooks/useLocales';

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string,
};

export default function SearchNotFound({ searchQuery = '', ...other }) {
  const { translate } = useLocales();

  return searchQuery ? (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        {translate('message.notFound')}
      </Typography>
      <Typography variant="body2" align="center">
        {translate('message.noResult', { keyword: searchQuery })}
      </Typography>
    </Paper>
  ) : (
    <Typography variant="body2"> {translate('message.noData')}</Typography>
  );
}