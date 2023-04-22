// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import Settings from './components/settings';
import { ChartStyle } from './components/chart';
import ScrollToTop from './components/ScrollToTop';
import { ProgressBarStyle } from './components/ProgressBar';
import NotistackProvider from './components/NotistackProvider';
import ThemeColorPresets from './components/ThemeColorPresets';
import ThemeLocalization from './components/ThemeLocalization';
import MotionLazyContainer from './components/animate/MotionLazyContainer';
import useAuth from './hooks/useAuth';
import LoadingScreen from './components/LoadingScreen';

// ----------------------------------------------------------------------

export default function App() {
  const { isInitialized } = useAuth();

  return (
    <ThemeProvider>
      <ThemeColorPresets>
        <ThemeLocalization>
          <NotistackProvider>
            <MotionLazyContainer>
              <ProgressBarStyle />
              <ChartStyle />
              <Settings />
              <ScrollToTop />
              {!isInitialized ? <LoadingScreen /> : <Router />}
            </MotionLazyContainer>
          </NotistackProvider>
        </ThemeLocalization>
      </ThemeColorPresets>
    </ThemeProvider>
  );
}
