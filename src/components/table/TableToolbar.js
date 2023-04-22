import { IconButton, InputAdornment, Stack, styled, Toolbar, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
// components
import useLocales from '../../hooks/useLocales';
import Iconify from '../Iconify';
import InputStyle from '../InputStyle';

// ----------------------------------------------------------------------

TableToolbar.propTypes = {
  filterName: PropTypes.string,
  showFilter: PropTypes.func,
  onFilterName: PropTypes.func
};

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

export default function TableToolbar({
  showFilter, filterName, onFilterName
}) {
  const { translate } = useLocales()

  return (
    <RootStyle>
      <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} >
        <InputStyle
          stretchStart={240}
          value={filterName}
          onChange={(event) => onFilterName(event.target.value)}
          placeholder={translate('label.search')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <Tooltip title="Filter list">
        <IconButton onClick={showFilter}>
          <Iconify icon={'ic:round-filter-list'} />
        </IconButton>
      </Tooltip>
    </RootStyle>
  );
}
