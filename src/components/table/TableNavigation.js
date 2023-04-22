// @mui
import { Box, FormControlLabel, Switch, TablePagination } from '@mui/material';
import PropTypes from 'prop-types';
import useLocales from '../../hooks/useLocales';

// ----------------------------------------------------------------------

TableNavigation.propTypes = {
  totalElements: PropTypes.number,
  search: PropTypes.object,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  dense: PropTypes.bool,
  onChangeDense: PropTypes.func

};

export default function TableNavigation({ totalElements, search, onPageChange, onRowsPerPageChange, dense, onChangeDense }) {
  const { translate } = useLocales()

  return (
    <Box sx={{ position: 'relative' }}>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={totalElements}
        rowsPerPage={search.size}
        page={search.page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
      <FormControlLabel
        control={<Switch checked={dense} onChange={(e) => onChangeDense(e.target.checked)} />}
        label={translate("label.dense")}
        sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
      />
    </Box>
  )
}
