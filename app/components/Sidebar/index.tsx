import { Box, Typography } from '@mui/material';
import { useLoaderData } from '@remix-run/react';
import WatchList from '../WatchList';
import AuthArea from './AuthArea';
import UserArea from './UserArea';

function Sidebar() {
  const { user } = useLoaderData();

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box
        position="sticky"
        top="0"
        sx={{ backdropFilter: 'blur(10px)' }}
        zIndex="10"
      >
        {user && <UserArea />}
        {!user && <AuthArea />}
      </Box>
      <Box paddingX={(theme) => theme.spacing(3)}>
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
