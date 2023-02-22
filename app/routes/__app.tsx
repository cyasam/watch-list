import { Drawer, styled } from '@mui/material';
import { Box } from '@mui/system';
import type { LoaderArgs } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
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
      <Main open={true}>
        <Outlet />
      </Main>
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
