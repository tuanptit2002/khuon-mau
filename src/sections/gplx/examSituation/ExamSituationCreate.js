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
import ExamSituationNewForm from './ExamSituationNewForm';

// ----------------------------------------------------------------------

export default function ExamCreate() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();
  const { pathname } = useLocation();
  const { id } = useParams();
  const isEdit = pathname.includes('edit');
  const isView = pathname.includes('view');
  const isNew = !isEdit && !isView;
  const { error, examSituations } = useSelector((state) => state.examSituation);

  const examSituation = examSituations.find(c => c.id === parseInt(id, 10));

  return (
    <Page title={isNew ? translate('gplx.examSituation.newExamSituation') : examSituation?.title}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={isNew ? translate('gplx.examSituation.newExamSituation') : examSituation?.title}
          links={[
            { name: translate('menu.dashboard'), href: PATH_DASHBOARD.root },
            {
              name: translate('menu.gplx'),
              href: PATH_DASHBOARD.gplx.root,
            },
            {
              name: translate('menu.gplx'),
              href: PATH_DASHBOARD.gplx.exams,
            },
            { name: isNew ? translate('gplx.examSituation.newExamSituation') : examSituation?.title || '' },
          ]}
        />
        {error && (isEdit || isView) ? (
          <Box sx={{ py: 3 }}>
            <ErrorOccur error={error} />
          </Box>
        ) :
          <ExamSituationNewForm isEdit={isEdit} currentExamSituation={isEdit || isView ? examSituation : null} isView={isView} />
        }
      </Container>
    </Page>
  );
}
