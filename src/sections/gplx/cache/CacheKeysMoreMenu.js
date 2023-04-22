import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { IconButton, MenuItem } from '@mui/material';
// components
import Iconify from '../../../components/Iconify';
import MenuPopover from '../../../components/MenuPopover';
import useLocales from '../../../hooks/useLocales';

// ----------------------------------------------------------------------

CacheKeysMoreMenu.propTypes = {
  onDelete: PropTypes.func,
};

export default function CacheKeysMoreMenu({ onDelete }) {
  const [open, setOpen] = useState(null);
  const { translate } = useLocales();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const ICON = {
    mr: 2,
    width: 20,
    height: 20,
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        arrow="right-top"
        sx={{
          mt: -1,
          width: 160,
          '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
        }}
      >
        <MenuItem onClick={onDelete} sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ ...ICON }} />
          {translate("button.delete")}
        </MenuItem>
      </MenuPopover>
    </>
  );
}
