import PropTypes from 'prop-types';
// @mui
import { IconButton, InputAdornment, Toolbar, Tooltip, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
// components
import useLocales from '../../hooks/useLocales';
import Iconify from '../Iconify';
import InputStyle from '../InputStyle';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

// ----------------------------------------------------------------------

DataGridListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onDelete: PropTypes.func,
  showFilter: PropTypes.func,
  actions: PropTypes.node
};

export default function DataGridListToolbar({ numSelected, filterName, onFilterName, onDelete, showFilter, actions }) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const { translate } = useLocales();

  if (numSelected > 0)
    return (
      <RootStyle sx={{
        color: isLight ? 'primary.main' : 'text.primary',
        bgcolor: isLight ? 'primary.lighter' : 'primary.dark',
      }}>
        <Typography component="div" variant="subtitle1">
          {numSelected} {translate("label.selected")}
        </Typography>

        {actions && actions || (
          <Tooltip title="Delete">
            <IconButton onClick={onDelete}>
              <Iconify icon={'eva:trash-2-outline'} />
            </IconButton>
          </Tooltip>
        )}
      </RootStyle>
    );

  return (
    <RootStyle>
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
      <Tooltip title="Filter list">
        <IconButton onClick={showFilter}>
          <Iconify icon={'ic:round-filter-list'} />
        </IconButton>
      </Tooltip>
    </RootStyle>
  );
}
