import { Box, Typography } from '@mui/material';
import { useLoaderData } from '@remix-run/react';
import Item from './Item';

function WatchList() {
  const { user, watchList } = useLoaderData();

  return (
    <Box height="100%" overflow="auto" flex="1">
      {!user && <Typography textAlign="center">You need to login.</Typography>}
      {watchList?.data?.length === 0 && (
        <Typography textAlign="center">Let's add a new movie!</Typography>
      )}
      {watchList?.data?.map((item: any) => {
        return <Item key={item.id} item={item} />;
      })}
      {watchList?.error && (
        <Typography textAlign="center">{watchList?.error}</Typography>
      )}
    </Box>
  );
}

export default WatchList;
