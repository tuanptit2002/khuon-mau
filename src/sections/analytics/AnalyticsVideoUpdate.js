// @mui
import { Box, Button, Card, CardHeader, Divider, Stack, Typography } from '@mui/material';
// utils
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { mediaBaseURL } from '../../config';

// components
import Iconify from '../../components/Iconify';
import Image from '../../components/Image';
import Scrollbar from '../../components/Scrollbar';
import useLocales from '../../hooks/useLocales';
import { PATH_DASHBOARD } from '../../routes/paths';

// ---
export default function AnalyticsVideoUpdate() {
  const { translate } = useLocales();
  const { situations } = useSelector((state) => state.situation);

  return (
    <Card>
      <CardHeader title={translate('gplx.situation.listSituation')} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {situations.map((v) => (
            <VideoItem key={v.id} item={v} />
          ))}
        </Stack>
      </Scrollbar>

      <Divider />

      <Box sx={{ p: 2, textAlign: 'left' }}>
        <Button size="small" LinkComponent={Link} to={PATH_DASHBOARD.gplx.situations} color="inherit" endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}>
          {translate('button.preview')}
        </Button>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

// eslint-disable-next-line react/prop-types
function VideoItem({ item }) {
  // eslint-disable-next-line react/prop-types
  const { id, title, createdAt, status } = item;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Image alt={title} src={`${mediaBaseURL}/stream/video/${id}/thumbnail/thumb.jpg`} sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }} />
      <Box sx={{ minWidth: 240 }}>
        <Typography variant="subtitle2" noWrap>
          {title}
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
        {status}
      </Typography>
      <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
        {createdAt}
      </Typography>
    </Stack>
  );
}
