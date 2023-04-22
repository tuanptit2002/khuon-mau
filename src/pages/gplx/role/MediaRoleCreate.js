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
import RoleNewForm from '../../../sections/gplx/role/RoleNewForm';

// ----------------------------------------------------------------------

export default function MediaRoleCreate() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();
  const { pathname } = useLocation();
  const { id } = useParams();
  const isEdit = pathname.includes('edit');
  const isView = pathname.includes('view');
  const isNew = !isEdit && !isView;
  const { error, roles } = useSelector((state) => state.mediaRole);

  const role = roles.find(c => c.id === parseInt(id, 10));

  return (
    <Page title={isNew ? translate('media.role.newRole') : role?.role}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={isNew ? translate('media.role.newRole') : role?.role}
          links={[
            { name: translate('menu.dashboard'), href: PATH_DASHBOARD.root },
            {
              name: translate('menu.gplx'),
              href: PATH_DASHBOARD.gplx.root,
            },
            {
              name: translate('menu.role'),
              href: PATH_DASHBOARD.gplx.roles,
            },
            { name: isNew ? translate('media.role.newRole') : role?.role || '' },
          ]}
        />
        {error && (isEdit || isView) ? (
          <Box sx={{ py: 3 }}>
            <ErrorOccur error={error} />
          </Box>
        ) :
          <RoleNewForm isEdit={isEdit} isView={isView} currentRole={!isNew ? role : null} />
        }
      </Container>
    </Page>
  );
}
