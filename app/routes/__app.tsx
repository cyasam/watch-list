import { useCallback } from 'react';
import { Button, Drawer, styled } from '@mui/material';
import { Box } from '@mui/system';
import type { LoaderArgs } from '@remix-run/node';
import { Outlet, Link as RouterLink, useMatches } from '@remix-run/react';
import Sidebar from '~/components/Sidebar';
import { getUserSession } from '~/data/auth.server';
import { getWatchlist } from '~/data/movies.server';

const drawerWidth = 320;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

function AppLayout() {
  const matches = useMatches();

  const isActive = useCallback(
    (routeId: string) => {
      return !!matches.find((match) => match.id === routeId);
    },
    [matches]
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={true}
      >
        <Sidebar />
      </Drawer>
      <Box>
        <Box
          padding={(theme) => theme.spacing(3)}
          position="sticky"
          top={0}
          zIndex={1}
          sx={{ backdropFilter: 'blur(20px)' }}
          mb={(theme) => theme.spacing(-3)}
        >
          <Button
            variant={isActive('routes/__app/index') ? 'contained' : 'outlined'}
            component={RouterLink}
            to="/"
            sx={{ marginRight: 3 }}
          >
            Popular
          </Button>
          <Button
            variant={
              isActive('routes/__app/top-rated') ? 'contained' : 'outlined'
            }
            component={RouterLink}
            to="/top-rated"
            sx={{ marginRight: 3 }}
          >
            Top Rated
          </Button>
        </Box>
        <Main open={true}>
          <Outlet />
        </Main>
      </Box>
    </Box>
  );
}

export async function loader({ request }: LoaderArgs) {
  const user = await getUserSession(request.headers.get('Cookie'));

  if (!user) {
    return { user };
  }

  return { user, watchList: await getWatchlist(user.id) };
}

export default AppLayout;
