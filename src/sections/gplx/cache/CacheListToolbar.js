import PropTypes from 'prop-types';
// @mui
import { IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
// components
import Iconify from '../../../components/Iconify';
import useLocales from '../../../hooks/useLocales';
// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

// ----------------------------------------------------------------------

CacheListToolbar.propTypes = {
  numSelected: PropTypes.number,
  onDelete: PropTypes.func,
  showFilter: PropTypes.func,
  actions: PropTypes.node
};

export default function CacheListToolbar({ numSelected, onDelete, showFilter, actions }) {
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
      <Tooltip title="Filter list">
        <IconButton onClick={showFilter}>
          <Iconify icon={'ic:round-filter-list'} />
        </IconButton>
      </Tooltip>
    </RootStyle>
  );
}
