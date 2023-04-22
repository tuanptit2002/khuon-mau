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
import PrivilegeNewForm from '../../../sections/gplx/privilege/PrivilegeNewForm';

// ----------------------------------------------------------------------

export default function MediaPrivilegeCreate() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();
  const { pathname } = useLocation();
  const { id } = useParams();
  const isEdit = pathname.includes('edit');
  const isView = pathname.includes('view');
  const isNew = !isEdit && !isView;
  const { error, privileges } = useSelector((state) => state.mediaPrivilege);

  const privilege = privileges.find(c => c.id === parseInt(id, 10));

  return (
    <Page title={isNew ? translate('media.privilege.newPrivilege') : privilege?.authority}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={isNew ? translate('media.privilege.newPrivilege') : privilege?.authority}
          links={[
            { name: translate('menu.dashboard'), href: PATH_DASHBOARD.root },
            {
              name: translate('menu.gplx'),
              href: PATH_DASHBOARD.gplx.root,
            },
            {
              name: translate('menu.privilege'),
              href: PATH_DASHBOARD.gplx.privileges,
            },
            { name: isNew ? translate('media.privilege.newPrivilege') : privilege?.authority || '' },
          ]}
        />
        {error && (isEdit || isView) ? (
          <Box sx={{ py: 3 }}>
            <ErrorOccur error={error} />
          </Box>
        ) :
          <PrivilegeNewForm isEdit={isEdit} item={isEdit || isView ? privilege : null} isView={isView} />
        }
      </Container>
    </Page>
  );
}
