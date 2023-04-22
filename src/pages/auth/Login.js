import { capitalCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, Card, Container, Link, Stack, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// routes
import { PATH_AUTH } from '../../routes/paths';
// hooks
import useAuth from '../../hooks/useAuth';
import useResponsive from '../../hooks/useResponsive';
// components
import Image from '../../components/Image';
import Logo from '../../components/Logo';
import Page from '../../components/Page';
// sections
import AuthFirebaseSocials from '../../sections/auth/AuthFirebaseSocial';
import { LoginForm } from '../../sections/auth/login';
import useLocales from '../../hooks/useLocales';
import LanguagePopover from '../../layouts/dashboard/header/LanguagePopover';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  const { method } = useAuth();

  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');
  const { translate } = useLocales()

  return (
    <Page title="Login">
      <RootStyle>
        <HeaderStyle>
          <Logo />
          {smUp && (
            <Typography variant="body2" sx={{ mt: { md: -2 } }}>
              {translate("label.dontHaveAccount")}
              <Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.register}>
                {translate("label.getStarted")}
              </Link>
            </Typography>
          )}
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome Back
            </Typography>
            <Image
              alt="login"
              src={`${process.env.PUBLIC_URL}/static/illustrations/illustration_login.png`}
            />
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  {translate("label.signinToJmaster")}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>{translate("label.enterDetailsBelow")}</Typography>
              </Box>

              <Tooltip title={capitalCase(method)} placement="right">
                <>
                  <Image
                    disabledEffect
                    src={`${process.env.PUBLIC_URL}/static/auth/ic_${method}.png`}
                    sx={{ width: 32, height: 32 }}
                  />
                </>
              </Tooltip>
              <LanguagePopover />
            </Stack>

            {method === 'firebase' && <AuthFirebaseSocials />}
            <LoginForm />

            {!smUp && (
              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                {translate("label.dontHaveAccount")}
                <Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.register}>
                  {translate("label.getStarted")}
                </Link>
              </Typography>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
