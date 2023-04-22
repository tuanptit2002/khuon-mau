// @mui
import { Box, TableCell, TableRow } from '@mui/material';
import PropTypes from 'prop-types';
import ErrorOccur from '../ErrorOccur';
//
import SearchNotFound from '../SearchNotFound';

// ----------------------------------------------------------------------

TableNoData.propTypes = {
  isNotFound: PropTypes.bool,
  length: PropTypes.number,
  searchQuery: PropTypes.string,
  error: PropTypes.object
};

export default function TableNoData({ isNotFound, length, searchQuery, error }) {
  if (error)
    return (
      <TableRow>
        <TableCell colSpan={length} align="center">
          <Box sx={{ py: 3 }}><ErrorOccur error={error} />
          </Box>
        </TableCell>
      </TableRow>
    );

  if (isNotFound)
    return (
      <TableRow>
        <TableCell colSpan={length} align="center">
          <Box sx={{ py: 3 }}>
            <SearchNotFound searchQuery={searchQuery} />
          </Box>
        </TableCell>
      </TableRow>
    );

  return (
    <TableRow>
      <TableCell colSpan={length} sx={{ p: 0 }} />
    </TableRow>
  );
}
