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
import EditForm from '../../../sections/gplx/situation/SituationEditForm';
import NewForm from '../../../sections/gplx/situation/SituationNewForm';

// ----------------------------------------------------------------------

export default function SituationCreate() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();
  const { pathname } = useLocation();
  const { id } = useParams();
  const isEdit = pathname.includes('edit');
  const isView = pathname.includes('view');
  const isNew = !isEdit && !isView;
  const { error, situations } = useSelector((state) => state.situation);

  const situation = situations.find(c => c.id === id);

  const renderForm = () => {
    if (isNew)
      return <NewForm />;

    return error ? <Box sx={{ py: 3 }}>
      <ErrorOccur error={error} />
    </Box> : <EditForm isEdit={isEdit} currentItem={situation} isView={isView} />;
  };

  return (
    <Page title={isNew ? translate('gplx.situation.newSituation') : situation?.title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={isNew ? translate('gplx.situation.newSituation') : situation?.title}
          links={[
            { name: translate('menu.dashboard'), href: PATH_DASHBOARD.root },
            {
              name: translate('menu.gplx'),
              href: PATH_DASHBOARD.gplx.root,
            },
            {
              name: translate('menu.situation'),
              href: PATH_DASHBOARD.gplx.situations,
            },
            { name: isNew ? translate('gplx.situation.newSituation') : situation?.title || '' },
          ]}
        />
        {renderForm()}
      </Container>
    </Page>
  );
}
