import { Drawer, styled as styledMui } from '@mui/material';
import { Box } from '@mui/system';
import type { LoaderArgs } from '@remix-run/node';
import { AnimatePresence, motion } from 'framer-motion';
import styled from '@emotion/styled';
import { Outlet, useLocation } from '@remix-run/react';
import Sidebar from '~/components/Sidebar';
import { getUserSession } from '~/data/auth.server';
import { getWatchlist } from '~/data/movies.server';
import Navigation from '~/components/Navigation';
import SearchArea from '~/components/SearchArea';

const drawerWidth = 320;

const Main = styledMui('main', {
  shouldForwardProp: (prop) => prop !== 'open',
})<{
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
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
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

        <Box width="100%">
          <Box
            padding={(theme) => theme.spacing(3)}
            position="sticky"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            top={0}
            zIndex={1}
            sx={{ backdropFilter: 'blur(20px)' }}
            mb={(theme) => theme.spacing(-3)}
          >
            <Navigation />
            <SearchArea />
          </Box>

          <Main open={true}>
            <AnimatedDiv
              key={location.pathname}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Outlet />
            </AnimatedDiv>
          </Main>
        </Box>
      </Box>
    </AnimatePresence>
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

export const AnimatedDiv = styled(motion.div)``;
