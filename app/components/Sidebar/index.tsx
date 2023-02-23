import { Box, Typography } from '@mui/material';
import { useLoaderData } from '@remix-run/react';
import WatchList from '../WatchList';
import AuthArea from './AuthArea';
import UserArea from './UserArea';

function Sidebar() {
  const { user } = useLoaderData();

  return (
    <Box
      display="flex"
      flexDirection="column"
      padding={(theme) => theme.spacing(3)}
      height="100vh"
    >
      <Box position="sticky" top="0" sx={{ backdropFilter: 'blur(10px)' }}>
        {user && <UserArea />}
        {!user && <AuthArea />}
      </Box>
      <Box>
        <Typography
          variant="h6"
          component="h2"
          marginBottom={(theme) => theme.spacing(2)}
          textAlign="center"
        >
          Watch List
        </Typography>
        <WatchList />
      </Box>
    </Box>
  );
}

export default Sidebar;