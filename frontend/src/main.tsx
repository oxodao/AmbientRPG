import { HashRouter, Route, Routes } from 'react-router-dom'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ViewerPage from './pages/viewer'
import IndexPage from './pages'
import AppProvider from './context'
import GameMaster from './pages/game_master'
import SettingsPage from './pages/game_master/settings'
import { SnackbarProvider } from 'notistack'
import Cookies from 'js-cookie';
import GameMasterLayout from './pages/game_master/layout'
import { createTheme, ThemeProvider } from '@mui/material'

import 'dockview-core/dist/styles/dockview.css';
import "@fontsource/open-sans/400.css";
import '@mdxeditor/editor/style.css'
import './assets/cp77.scss'
import './assets/index.scss'
import CampaignsPage from './pages/game_master/campaigns'


fetch('/api/mercure-token').then(resp => resp.json().then(data => {
    if (resp.status !== 200) {
      const msg = 'Failed to retreive Mercure token. Preventing from continuing as it would make the software useless';
      const root = document.getElementById('root');
      if (root){
        root.innerText = msg;
      }

      throw new Error(msg);
    }

    // Overriding each time, idc, they have no expiration anyway
    Cookies.set('mercureAuthorization', data.token, { sameSite: 'lax' });

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
                <Route path="/viewer" element={<ViewerPage />} />

                <Route path="/game-master" element={<GameMasterLayout />}>
                  <Route path="" element={<GameMaster />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="campaigns" element={<CampaignsPage />} />
                </Route>

                <Route path="" element={<IndexPage />} />
              </Routes>
            </HashRouter>

            <SnackbarProvider anchorOrigin={{vertical: 'top', horizontal: 'right'}}/>
          </AppProvider>
        </ThemeProvider>
      </StrictMode>,
    )
  }));