import { useLocation, useParams } from 'react-router-dom';
// @mui
import { Box, Container } from '@mui/material';
// redux
import { useSelector } from '../../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import ErrorOccur from '../../../components/ErrorOccur';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Page from '../../../components/Page';
import useLocales from '../../../hooks/useLocales';
import UserEditForm from '../../../sections/gplx/user/UserEditForm';

// ----------------------------------------------------------------------

export default function MediaUserEdit() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();
  const { pathname } = useLocation();
  const { id } = useParams();

  const isEditRole = pathname.includes('role');
  const isEditEmail = pathname.includes('email');
  const isEditStatus = pathname.includes('status');
  const isEditPhone = pathname.includes('phone');
  const isEditInfo = pathname.includes('info');
  const isView = pathname.includes('view');

  const { error, users } = useSelector((state) => state.mediaUser);
  const user = users.find(c => c.id === id);

  return (
    <Page title={user?.displayName}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={`${user?.displayName}`}
          links={[
            { name: translate('menu.dashboard'), href: PATH_DASHBOARD.root },
            {
              name: translate('menu.gplx'),
              href: PATH_DASHBOARD.gplx.root,
            },
            {
              name: translate('menu.user'),
              href: PATH_DASHBOARD.gplx.users,
            },
            { name: user?.displayName || '' },
          ]}
        />
        {error ? (
          <Box sx={{ py: 3 }}>
            <ErrorOccur error={error} />
          </Box>
        ) :
          <UserEditForm currentUser={user} isEditRole={isEditRole}
            isEditEmail={isEditEmail} isEditPhone={isEditPhone} isEditInfo={isEditInfo} isEditStatus={isEditStatus} isView={isView} />
        }
      </Container>
    </Page>
  );
}
