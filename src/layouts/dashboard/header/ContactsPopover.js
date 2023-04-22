import { useEffect, useState } from 'react';
// @mui
import { Avatar, ListItemAvatar, ListItemText, MenuItem, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
// utils
import { useSelector } from '../../../redux/store';
// components
import { IconButtonAnimate } from '../../../components/animate';
import BadgeStatus from '../../../components/BadgeStatus';
import Iconify from '../../../components/Iconify';
import MenuPopover from '../../../components/MenuPopover';
import Scrollbar from '../../../components/Scrollbar';
import useLocales from '../../../hooks/useLocales';

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 64;

// ----------------------------------------------------------------------

export default function ContactsPopover() {
  const { translate } = useLocales();

  const [open, setOpen] = useState(null);
  const { accounts, totalElements, search } = useSelector((state) => state.userAccount);

  // const dispatch = useDispatch();
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      // dispatch(getUserAccounts())
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);// eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButtonAnimate
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          ...(open && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
          }),
        }}
      >
        <Iconify icon={'eva:people-fill'} width={20} height={20} />
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          mt: 1.5,
          ml: 0.75,
          width: 320,
          '& .MuiMenuItem-root': {
            px: 1.5,
            height: ITEM_HEIGHT,
            borderRadius: 0.75,
          },
        }}
      >
        <Typography variant="h6" sx={{ p: 1.5 }}>
          {translate('menu.account')} <Typography component="span">({totalElements})</Typography>
        </Typography>

        <Scrollbar sx={{ height: ITEM_HEIGHT * 6 }} >
          {accounts.map((contact) => (
            <MenuItem key={contact.id}>
              <ListItemAvatar sx={{ position: 'relative' }}>
                <Avatar src={contact.photoURL} />
                <BadgeStatus status={contact.status || "online"} sx={{ position: 'absolute', right: 1, bottom: 1 }} />
              </ListItemAvatar>

              <ListItemText
                primaryTypographyProps={{ typography: 'subtitle2', mb: 0.25 }}
                secondaryTypographyProps={{ typography: 'caption' }}
                primary={contact.displayName}
                secondary={(contact.createdAt)}
              />
            </MenuItem>
          ))}
        </Scrollbar>
      </MenuPopover>
    </>
  );
}
