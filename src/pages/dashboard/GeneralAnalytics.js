// @mui
import { Container, Grid, Typography } from '@mui/material';
// hooks
import { useEffect, useState } from 'react';
import useSettings from '../../hooks/useSettings';
import AnalyticsVideoUpdate from '../../sections/analytics/AnalyticsVideoUpdate';
import { getMediaStatisticAPI } from '../../service/gplx/gplx.statistic.service';
// components
import Page from '../../components/Page';
import useLocales from '../../hooks/useLocales';
import AnalyticsWidgetSummary from '../../sections/analytics/AnalyticsWidgetSummary';
// sections

// ----------------------------------------------------------------------

export default function GeneralAnalytics() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();
  const [statistic, setStatistic] = useState({ videos: 0, durations: 0, views: 0, users: 0 });

  const getData = async () => {
    const resp = await getMediaStatisticAPI();

    if (resp.code === '200')
      setStatistic(resp.data);
  };

  useEffect(() => { getData(); }, []);

  return (
    <Page title={translate("menu.dashboard")}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary title={translate("menu.situation")} total={statistic.videos} icon={'material-symbols:slow-motion-video'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary title={translate("gplx.situation.duration")} total={statistic.durations / 60} color="warning" icon={'ic:baseline-access-time'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary title={translate("button.view")} total={statistic.views} color="error" icon={'ic:outline-remove-red-eye'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary title={translate("menu.user")} total={statistic.users} color="info" icon={'mdi:user-group'} />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <AnalyticsVideoUpdate />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
