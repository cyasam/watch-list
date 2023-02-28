import type { MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { css } from '@emotion/css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const pageTitle = 'Watch List';

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: pageTitle,
  viewport: 'width=device-width,initial-scale=1',
});

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <html lang="en">
        <head>
          <Meta />
          <Links />
        </head>
        <body
          className={css`
            min-height: 100vh;
          `}
        >
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </ThemeProvider>
  );
}

export function links() {
  return [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap',
    },
  ];
}
