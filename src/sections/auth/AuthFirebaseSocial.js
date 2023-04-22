// @mui
import { Stack, Button, Divider, Typography } from '@mui/material';
// components
import Iconify from '../../components/Iconify';
import useAuth from '../../hooks/useAuth';

// ----------------------------------------------------------------------

export default function AuthFirebaseSocial() {
  const { loginWithGoogle, loginWithFaceBook, loginWithApple } = useAuth();

  return (
    <>
      <Stack direction="row" spacing={2}>
        <Button fullWidth size="large" color="inherit" variant="outlined" onClick={loginWithGoogle}>
          <Iconify icon={'eva:google-fill'} color="#DF3E30" width={24} height={24} />
        </Button>

        <Button fullWidth size="large" color="inherit" variant="outlined" onClick={loginWithFaceBook}>
          <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={24} height={24} />
        </Button>

        <Button fullWidth size="large" color="inherit" variant="outlined" onClick={loginWithApple}>
          <Iconify icon={'ic:sharp-apple'} color="#333333" width={24} height={24} />
        </Button>
      </Stack>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>
    </>
  );
}
