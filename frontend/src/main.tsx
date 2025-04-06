import { HashRouter, Route, Routes } from 'react-router-dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ViewerPage from './pages/viewer';
import IndexPage from './pages';
import AppProvider from './context';
import GameMaster from './pages/game_master';
import SettingsPage from './pages/game_master/settings';
import { SnackbarProvider } from 'notistack';
import Cookies from 'js-cookie';
import GameMasterLayout from './pages/game_master/layout';
import CampaignsPage from './pages/game_master/campaigns';
import { createTheme, ThemeProvider } from '@mui/material';

import 'dockview-core/dist/styles/dockview.css';
import "@fontsource/open-sans/400.css";
import '@mdxeditor/editor/style.css';

import './assets/index.scss';
import './assets/viewer.scss';


const startMethod = async () => {
  const respMercure = await fetch('/api/mercure-token');
  if (respMercure.status !== 200) {
    const msg = 'Failed to retreive Mercure token. Preventing from continuing as it would make the software useless';
    const root = document.getElementById('root');
    if (root) {
      root.innerText = msg;
    }

    throw new Error(msg);
  }

  const dataMercure = await respMercure.json();

  // Overriding each time, idc, they have no expiration anyway
  Cookies.set('mercureAuthorization', dataMercure.token, { sameSite: 'lax' });

  // @TODO: Rewrite properly
  const resp = await fetch('/api/state');
  const data = await resp.json();

  const theme = data.campaign?.gameType ?? '';

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ThemeProvider theme={createTheme({
        palette: {
          mode: 'dark',
        },
        typography: {
          allVariants: {
            color: 'white',
          },
          fontFamily: ['Open Sans'].join(','),
          h1: {
            fontSize: '1.8rem',
          }
        },
        components: {
          MuiAccordion: {
            styleOverrides: {
              root: {
                backgroundColor: 'transparent'
              }
            }
          }
        }
      })}>
        <AppProvider>
          <HashRouter>
            <Routes>
              <Route path="/viewer" element={<ViewerPage theme={theme} />} />

              <Route path="/game-master" element={<GameMasterLayout theme={theme} />}>
                <Route path="" element={<GameMaster />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="campaigns" element={<CampaignsPage />} />
              </Route>

              <Route path="" element={<IndexPage theme={theme} />} />
            </Routes>
          </HashRouter>

          <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'right' }} />
        </AppProvider>
      </ThemeProvider>
    </StrictMode>,
  );
};

startMethod();